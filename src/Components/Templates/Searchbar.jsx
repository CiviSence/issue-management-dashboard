import React from "react";
import { useUser } from "../../Context/ProfileContext";

const Searchbar = () => {
  const { profileData } = useUser();
  return (
    <div
      className="
        bg-white
        w-full
        md:w-[60%]
        lg:w-[40%]
        xl:w-[35%]
        rounded-full
        p-2
        flex
        items-center
        justify-between
        gap-3
      "
    >
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        className="
          w-full
          md:w-[55%]
          bg-[#F0EEFF]
          px-4
          py-2
          rounded-full
          focus:outline-none
          text-sm
        "
      />

      {/* Right Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        <i className="ri-notification-3-line text-lg sm:text-xl text-[#aaaaaa]"></i>
        <i className="ri-moon-line text-lg sm:text-xl text-[#aaaaaa]"></i>

        {/* User */}

        <div className="rounded-full bg-amber-300 h-9 w-9 text-center">
          <img
            src={profileData?.avatar_url}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-violet-500 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
