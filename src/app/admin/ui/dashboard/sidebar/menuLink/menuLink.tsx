"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

type MenuProps = {
    item:any
}

const MenuLink = ({item}:MenuProps) => {
  
    const pathname = usePathname();
  
    return (
    <Link href={item.path} className={`text-text- p-5 flex items-center  gap-5 my-2 mx-0 rounded-lg ${pathname === item.path && "bg-soft"}`}>
        {item.icon}
        {item.title}
    </Link>
  )
}

export default MenuLink