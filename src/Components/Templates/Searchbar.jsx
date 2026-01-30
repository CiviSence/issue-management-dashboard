import React from "react";

const Searchbar = () => {
  return (
    <div className="bg-white w-[35%] rounded-full p-2 flex items-center justify-between">
      <input
        type="text"
        placeholder="Search..."
        className="w-[50%] bg-[#F0EEFF] px-4 py-2 rounded-full focus:outline-none"
      />
      <div className="flex gap-8 items-center mr-4">
        <i class="ri-notification-3-line text-xl text-[#aaaaaa]"></i>
        <i class="ri-moon-line text-xl text-[#aaaaaa]"></i>
        
        <div className="flex gap-2">
          <i class="ri-user-line text-xl text-[#aaaaaa]"></i>
          <p className="text-[#aaaaaa]">Admin |</p>
          <i class="ri-arrow-down-s-line text-xl text-[#aaaaaa]"></i>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
