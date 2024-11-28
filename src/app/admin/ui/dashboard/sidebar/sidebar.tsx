"use client";

import { menuItems } from "@/app/admin/lib/data";
import Image from "next/image";
import React, { useState } from "react";
import MenuLink from "./menuLink/menuLink";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

type Props = {};

const Sidebar = (props: Props) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  return (
    <div className=" bg-primary sticky top-8  text-white p-4 rounded-lg shadow-lg ">
      <div className="flex items-center gap-4 mb-5 border-b  pb-4">
        <Image
          className="rounded-full object-cover"
          src="/assets/images/about-hero.png"
          alt="logo"
          width={50}
          height={50}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-xl">Admin</span>
          <span className="text-sm text-gray-400">Dashboard</span>
        </div>
      </div>

      <ul className="list-none space-y-2">
        {menuItems.map((item: any) => (
          <li key={item.title} className="mb-4">
            <div
              className="flex justify-between items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => toggleSection(item.title)}
            >
              <span className="font-semibold text-sm">{item.title}</span>
              {expandedSections.includes(item.title) ? <MdExpandLess /> : <MdExpandMore />}
            </div>

            {expandedSections.includes(item.title) && (
              <ul className="mt-2 ml-4 space-y-2">
                {item.list.map((subItem: any) => (
                  <MenuLink item={subItem} key={subItem.title} />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
