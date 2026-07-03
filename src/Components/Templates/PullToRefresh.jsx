import { useState, useEffect, useRef, useCallback } from 'react';

const PullToRefresh = ({ 
  onRefresh, 
  children, 
  scrollContainerId,
  disabled = false,
  pullThreshold = 70,
  maxPull = 140 
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshState, setRefreshState] = useState('idle'); // 'idle' | 'pulling' | 'releasing' | 'refreshing' | 'success'

  // Refs to avoid re-binding useEffect event listeners on every frame
  const pullDistanceRef = useRef(0);
  const refreshStateRef = useRef('idle');
  const onRefreshRef = useRef(onRefresh);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef(null);
  const hasVibratingRef = useRef(false);

  // Keep onRefresh ref updated without triggering effect re-binds
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // Sync state with refs for UI rendering
  const updateState = useCallback((distance, state) => {
    pullDistanceRef.current = distance;
    refreshStateRef.current = state;
    setPullDistance(distance);
    setRefreshState(state);
  }, []);

  // Smooth asymptotic rubber banding calculation (tactile iOS-like resistance)
  const calculateResistance = (dist) => {
    if (dist <= 0) return 0;
    if (dist <= pullThreshold) {
      return dist * 0.75; // Smooth initial pull
    }
    // Diminishing returns after crossing threshold
    const extra = dist - pullThreshold;
    const damped = pullThreshold * 0.75 + Math.pow(extra, 0.7) * 1.5;
    return Math.min(maxPull, damped);
  };

  useEffect(() => {
    if (disabled) return;

    let container = null;
    let retryTimeout = null;

    const setupListeners = () => {
      container = scrollContainerId 
        ? document.getElementById(scrollContainerId) 
        : containerRef.current;

      if (!container) {
        // If container isn't mounted yet in DOM, retry shortly
        retryTimeout = setTimeout(setupListeners, 100);
        return;
      }

      const getScrollTop = () => {
        return container ? container.scrollTop : 0;
      };

      const handleStart = (pageY) => {
        // Only trigger pull-to-refresh if we are at the top of the container
        if (getScrollTop() <= 1 && refreshStateRef.current === 'idle') {
          startY.current = pageY;
          isPulling.current = true;
          hasVibratingRef.current = false;
        }
      };

      const handleMove = (pageY, e) => {
        if (!isPulling.current) return;

        currentY.current = pageY;
        const rawDistance = currentY.current - startY.current;

        if (rawDistance > 0 && getScrollTop() <= 1) {
          // Prevent default browser overscroll / refresh when pulling down at top
          if (e && e.cancelable && e.preventDefault) {
            e.preventDefault();
          }

          const resistanceDistance = calculateResistance(rawDistance);

          if (resistanceDistance >= pullThreshold) {
            updateState(resistanceDistance, 'releasing');
            // Trigger tactile haptic vibration when crossing threshold
            if (!hasVibratingRef.current) {
              hasVibratingRef.current = true;
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                try { navigator.vibrate(12); } catch (err) { /* ignore */ }
              }
            }
          } else {
            updateState(resistanceDistance, 'pulling');
            if (hasVibratingRef.current) {
              hasVibratingRef.current = false;
            }
          }
        } else if (rawDistance < 0 && isPulling.current) {
          // If user scrolls back up, reset
          isPulling.current = false;
          updateState(0, 'idle');
        }
      };

      const handleEnd = async () => {
        if (!isPulling.current) return;
        isPulling.current = false;

        if (pullDistanceRef.current >= pullThreshold) {
          updateState(pullThreshold, 'refreshing');
          try {
            if (onRefreshRef.current) {
              await onRefreshRef.current();
            }
          } catch (error) {
            console.error('Refresh failed:', error);
          }

          // Transition to success state for satisfying closure micro-interaction
          updateState(pullThreshold, 'success');
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([10, 30, 10]); } catch (err) { /* ignore */ }
          }

          setTimeout(() => {
            updateState(0, 'idle');
          }, 600);
        } else {
          // Animate smoothly back to idle
          updateState(0, 'idle');
        }
      };

      // Touch events
      const onTouchStart = (e) => handleStart(e.touches[0].pageY);
      const onTouchMove = (e) => handleMove(e.touches[0].pageY, e);
      const onTouchEnd = () => handleEnd();

      // Mouse events for testing on desktop / trackpad drags
      let isMouseDown = false;
      const onMouseDown = (e) => {
        if (e.button !== 0) return; // Left click only
        isMouseDown = true;
        handleStart(e.pageY);
      };
      const onMouseMove = (e) => {
        if (!isMouseDown) return;
        handleMove(e.pageY, e);
      };
      const onMouseUp = () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        handleEnd();
      };

      container.addEventListener('touchstart', onTouchStart, { passive: true });
      container.addEventListener('touchmove', onTouchMove, { passive: false });
      container.addEventListener('touchend', onTouchEnd, { passive: true });
      container.addEventListener('touchcancel', onTouchEnd, { passive: true });

      // Attach desktop mouse listeners
      container.addEventListener('mousedown', onMouseDown, { passive: true });
      window.addEventListener('mousemove', onMouseMove, { passive: false });
      window.addEventListener('mouseup', onMouseUp, { passive: true });

      // Save cleanup function on container
      container._cleanupPullToRefresh = () => {
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchend', onTouchEnd);
        container.removeEventListener('touchcancel', onTouchEnd);
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    };

    setupListeners();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (container && container._cleanupPullToRefresh) {
        container._cleanupPullToRefresh();
      }
    };
  }, [disabled, pullThreshold, maxPull, scrollContainerId, updateState]);

  const isDragging = refreshState === 'pulling' || refreshState === 'releasing';
  const progress = Math.min(1, pullDistance / pullThreshold);

  return (
    <div ref={containerRef} className="relative w-full min-h-full flex flex-col">
      {/* Floating Pill Indicator */}
      <div 
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-[9999]"
        style={{ 
          top: '12px',
          opacity: pullDistance > 6 || refreshState !== 'idle' ? Math.min(1, pullDistance / 20) : 0,
          transform: `translateY(${
            refreshState === 'refreshing' || refreshState === 'success' 
              ? pullThreshold * 0.3 
              : Math.min(pullDistance * 0.45, pullThreshold * 0.65)
          }px) scale(${pullDistance > 10 || refreshState !== 'idle' ? Math.min(1.05, 0.8 + progress * 0.25) : 0.8})`,
          transition: isDragging ? 'none' : 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div 
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-md border select-none ${
            refreshState === 'success'
              ? 'bg-white/95 border-emerald-500/60 text-emerald-600 shadow-sm scale-102'
              : refreshState === 'releasing'
              ? 'bg-white/95 border-[#7E70EB]/70 text-[#7E70EB] shadow-sm scale-105'
              : refreshState === 'refreshing'
              ? 'bg-white/95 border-[#7E70EB]/40 text-[#7E70EB] shadow-sm animate-pulse'
              : 'bg-white/95 border-gray-200 text-gray-700 shadow-sm'
          }`}
        >
          {/* Icon */}
          <div className="flex items-center justify-center">
            {refreshState === 'refreshing' ? (
              <svg className="w-4 h-4 animate-spin text-[#7E70EB]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : refreshState === 'success' ? (
              <svg className="w-4 h-4 text-emerald-500 transition-transform duration-300 scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${
                  refreshState === 'releasing' 
                    ? 'text-[#7E70EB] rotate-180 scale-110' 
                    : 'text-gray-600'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>

          {/* Simple Text */}
          <span className="text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200">
            {refreshState === 'refreshing' && 'Refreshing...'}
            {refreshState === 'success' && 'Updated!'}
            {refreshState === 'releasing' && 'Release to refresh'}
            {refreshState === 'pulling' && 'Pull down to refresh'}
          </span>
        </div>
      </div>

      {/* Content wrapper */}
      <div 
        className="w-full min-h-full flex flex-col"
        style={{ 
          transform: `translateY(${pullDistance}px)`,
          transition: isDragging ? 'none' : 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;

