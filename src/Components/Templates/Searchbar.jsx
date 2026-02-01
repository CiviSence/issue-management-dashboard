import React from "react";

const Searchbar = () => {
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
      <div className="flex items-center gap-4 sm:gap-6 mr-2">
        <i className="ri-notification-3-line text-lg sm:text-xl text-[#aaaaaa]"></i>
        <i className="ri-moon-line text-lg sm:text-xl text-[#aaaaaa]"></i>

        {/* User */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <i className="ri-user-line text-lg sm:text-xl text-[#aaaaaa]"></i>
          {/* Hide text on very small screens */}
          <p className="hidden sm:block text-[#aaaaaa] text-sm">Admin |</p>
          <i className="ri-arrow-down-s-line text-lg sm:text-xl text-[#aaaaaa]"></i>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
