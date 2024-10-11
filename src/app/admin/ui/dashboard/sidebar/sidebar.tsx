import { menuItems } from "@/app/admin/lib/data";
import Image from "next/image";
import React from "react";
import MenuLink from "./menuLink/menuLink";

type Props = {};

const Sidebar = (props: Props) => {
  return (
    <div className="top-[40px]  ">
      <div className="flex items-center gap-4 mb-5">
        <Image
          className=" rounded-full object-cover"
          src="/assets/images/about-hero.png"
          alt="logo"
          width={50}
          height={50}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-text-light">Admin</span>
          <span className="text-sm text-text-light">Dashboard</span>
        </div>
      </div>

      <ul className=" list-none">
        {menuItems.map((item: any) => (
          <li key={item.title} className="">
            <span className="  font-semibold text-sm my-4 mx-0 text-text-light ">{item.title}</span>

            {item.list.map((subItem: any) => (
              <MenuLink item={subItem} key={subItem.title} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
