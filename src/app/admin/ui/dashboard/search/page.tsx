import React from 'react'
import { MdSearch } from 'react-icons/md'

type Props = {
    placeholder:string;
}

const Search = ({placeholder}:Props ) => {
  return (
    <div className="flex items-center gap-2 bg-primary p-2 rounded-[10px] w-fit">
           <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className="flex items-center gap-2 p-2 bg-transparent outline-none w-full"
        // onChange={handleSearch}
      />
    </div>
  )
}

export default Search