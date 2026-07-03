import { useState, useEffect, useRef } from 'react';

const PullToRefresh = ({ onRefresh, children, scrollContainerId }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshState, setRefreshState] = useState('idle'); // idle, pulling, releasing, refreshing

  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);
  const containerRef = useRef(null);

  const pullThreshold = 70; // px
  const maxPull = 120; // px

  useEffect(() => {
    const container = scrollContainerId 
      ? document.getElementById(scrollContainerId) 
      : containerRef.current;

    if (!container) return;

    const handleTouchStart = (e) => {
      // Only trigger pull-to-refresh if we are at the top of the container
      if (container.scrollTop === 0 && refreshState === 'idle') {
        startY.current = e.touches[0].pageY;
        isPulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current) return;

      currentY.current = e.touches[0].pageY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // Prevent default scrolling behavior when pulling down at the top
        if (e.cancelable) e.preventDefault();

        // Apply resistance (rubber-band effect)
        const resistanceDistance = Math.min(maxPull, distance * 0.4);
        setPullDistance(resistanceDistance);

        if (resistanceDistance >= pullThreshold) {
          setRefreshState('releasing');
        } else {
          setRefreshState('pulling');
        }
      } else {
        // If user pulls up, cancel
        isPulling.current = false;
        setPullDistance(0);
        setRefreshState('idle');
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling.current) return;
      isPulling.current = false;

      if (pullDistance >= pullThreshold) {
        setRefreshState('refreshing');
        setPullDistance(pullThreshold);
        try {
          await onRefresh();
        } catch (e) {
          console.error(e);
        }
        // Return smoothly to idle
        setTimeout(() => {
          setPullDistance(0);
          setRefreshState('idle');
        }, 300);
      } else {
        // Animate back to idle
        setPullDistance(0);
        setRefreshState('idle');
      }
    };

    // Use non-passive events for touchmove to allow preventDefault()
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, pullDistance, refreshState, scrollContainerId]);

  return (
    <div ref={containerRef} className="relative w-full min-h-full flex flex-col">
      {/* Pull Indicator Container */}
      <div 
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none transition-all duration-200 z-[9999]"
        style={{ 
          height: `${pullDistance}px`, 
          top: 0,
          opacity: pullDistance > 10 ? 1 : 0
        }}
      >
        <div className="bg-white p-2.5 rounded-full shadow-md border border-gray-150 flex items-center justify-center">
          {refreshState === 'refreshing' ? (
            <svg className="w-5 h-5 text-[#7E70EB] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
            </svg>
          ) : (
            <svg 
              className="w-5 h-5 text-[#7E70EB] transition-transform duration-200" 
              style={{ transform: `rotate(${pullDistance * 4}deg) scale(${Math.min(1.2, pullDistance / pullThreshold)})` }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      </div>
      {/* Content wrapper */}
      <div 
        className="w-full min-h-full flex flex-col transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
