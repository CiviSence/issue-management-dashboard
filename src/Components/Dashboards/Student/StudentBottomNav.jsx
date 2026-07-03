import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "../../../Context/ProfileContext";
import defaultPfpFemale from "../../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../../assets/default-pfp/default-pfp-male.svg";

const getDefaultAvatar = (gender) => {
    const g = gender?.toLowerCase();
    return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};

const tabs = [
    {
        to: "/feed",
        icon: "ri-compass-3-line",
        activeIcon: "ri-compass-3-fill",
        label: "Feed",
    },
    {
        to: "/dashboard",
        icon: "ri-dashboard-line",
        activeIcon: "ri-dashboard-fill",
        label: "Home",
    },
    {
        to: "/my-issues",
        icon: "ri-file-list-3-line",
        activeIcon: "ri-file-list-3-fill",
        label: "Issues",
    },
    {
        to: "/trust-center",
        icon: "ri-shield-check-line",
        activeIcon: "ri-shield-check-fill",
        label: "Trust",
    },
    {
        to: "/profile",
        label: "Profile",
        isAvatar: true,
    },
];

const StudentBottomNav = () => {
    const { pathname } = useLocation();
    const { profileData } = useUser();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    // Listen on document with capture to catch scrolls inside overflow containers
    const handleScroll = useCallback((e) => {
        if (ticking.current) return;
        ticking.current = true;

        requestAnimationFrame(() => {
            const target = e.target;
            // Get scrollTop from whichever element is scrolling
            const currentY =
                target === document || target === document.documentElement
                    ? window.scrollY
                    : target.scrollTop || 0;

            if (currentY < 20) {
                setVisible(true);
            } else if (currentY > lastScrollY.current + 10) {
                setVisible(false);
            } else if (currentY < lastScrollY.current - 10) {
                setVisible(true);
            }
            lastScrollY.current = currentY;
            ticking.current = false;
        });
    }, []);

    useEffect(() => {
        document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
        return () => document.removeEventListener("scroll", handleScroll, { capture: true });
    }, [handleScroll]);

    const avatarUrl = profileData?.avatar_url || getDefaultAvatar(profileData?.gender);

    return (
        <nav
            className={`
        fixed bottom-0 left-0 right-0
        md:hidden z-50
        pb-[env(safe-area-inset-bottom)]
        transition-transform duration-300 ease-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
        >
            <div
                className="
          mx-3 mb-2 px-2 py-1.5
          bg-white/80 backdrop-blur-xl
          border border-white/50
          rounded-2xl
          shadow-[0_4px_30px_rgba(0,0,0,0.08)]
          flex items-center justify-around
        "
            >
                {tabs.map((tab) => {
                    const isActive = pathname === tab.to;
                    return (
                        <NavLink
                            key={tab.to}
                            to={tab.to}
                            className="flex flex-col items-center justify-center py-1.5 px-3 relative group"
                        >
                            {isActive && (
                                <span className="absolute inset-0 bg-violet-50 rounded-xl -z-10" />
                            )}

                            {tab.isAvatar ? (
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    onError={(e) => { e.target.src = getDefaultAvatar(profileData?.gender); }}
                                    className={`
                        w-5.5 h-5.5 rounded-full object-cover transition-all duration-300
                        ${isActive
                                            ? "ring-2 ring-violet-500 ring-offset-1"
                                            : "ring-1 ring-gray-200 group-hover:ring-gray-300"
                                        }
                      `}
                                />
                            ) : (
                                <i
                                    className={`
                    ${isActive ? tab.activeIcon : tab.icon}
                    text-[20px] transition-all duration-300
                    ${isActive
                                            ? "text-violet-600"
                                            : "text-gray-400 group-hover:text-gray-600"
                                        }
                  `}
                                />
                            )}

                            <span
                                className={`
                  text-[10px] mt-0.5 font-semibold tracking-wide transition-all duration-300
                  ${isActive
                                        ? "text-violet-600"
                                        : "text-gray-400 group-hover:text-gray-600"
                                    }
                `}
                            >
                                {tab.label}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default StudentBottomNav;
