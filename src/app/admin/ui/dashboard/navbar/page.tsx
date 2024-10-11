"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";

type Props = {};

const Navbar = (props: Props) => {
  const pathname = usePathname();
  return (
    <div className="flex justify-between items-center rounded-lg p-5 bg-primary">
      <div className="title text-textSoft font-semibold text-xl capitalize ">
        {pathname.split("/").pop()}
      </div>

      <div className="menu flex items-center gap-4 ">
        <div className="search flex items-center gap-2 bg-[#2e374a] p-2 rounded-lg ">
          <MdSearch />
          <input
            type="text"
            placeholder="Search ..."
            className=" bg-transparent border-none text-text"
          />
        </div>
        <div className="flex gap-4">
        <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
