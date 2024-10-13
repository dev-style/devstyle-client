import Image from "next/image";
import React from "react";
import { MdPlayCircleFilled } from "react-icons/md";

type Props = {};

const Rightbar = (props: Props) => {
  return (
    <div className="fixed">
      <div className=" px-5 py-4 rounded-lg mb-4 relative">
        <div className=" mx-auto w-full h-50 mb-3 ">
          <Image
            src="/assets/images/metadata/devstyle.jpg"
            alt="user"
            width={100}
            height={50}
          />
        </div>
        <div className=" flex flex-col gap-5  ">
          <span className="font-bold text-text-light">🔥 Available Now</span>
          <h3 className="text-text-light font-semibold">How to use the new version of the admin dashboard?</h3>
          <span className=" text-text-light text-sm font-[500]">
            Takes 4 minutes to learn
          </span>
          <p className="text-text-light text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit eius libero perspiciatis recusandae possimus.
          </p>
          <button className="cursor-pointer border-none p-2 gap-2 flex items-center text-white bg-primary">
            <MdPlayCircleFilled />
            Watch
          </button>
        </div>
      </div>
   
    </div>
  );
};

export default Rightbar;
