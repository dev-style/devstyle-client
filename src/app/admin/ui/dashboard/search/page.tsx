"use client";
/* eslint-disable react/no-unescaped-entities */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  placeholder: string;
};

const Search = ({ placeholder }: Props) => {
  const pathName = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);
    console.log("params", params);

    if (e.target.value) {
      e.target.value.length > 2 && params.set("q", e.target.value);
    } else {
      params.delete("q");
    }

    replace(`${pathName}?${params}`);
  }, 300);

  return (
    <div className="flex items-center gap-2 bg-primary p-2 rounded-[10px] w-fit">
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className="flex items-center gap-2 p-2 bg-transparent outline-none w-full"
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
