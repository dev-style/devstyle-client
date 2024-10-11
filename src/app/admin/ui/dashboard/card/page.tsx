import React from "react";
import { MdSupervisedUserCircle } from "react-icons/md";

type Props = {
  item: { title: string; number: number; change: number };
};

const Card = ({ item }: Props) => {
  return (
    <div className="bg-primary p-5 rounded-lg flex gap-5 cursor-pointer w-full">
      <MdSupervisedUserCircle size={24} />
      <div className="flex flex-col gap-5">
        <span className="text-sm text-text-light font-medium">{item.title}</span>
        <span className="text-lg font-semibold text-text-light">{item.number}</span>
        <span className="text-sm font-semibold text-text-light">
          <span
            className={`${
              item.change > 0 ? "bg-green-500" : "bg-red-500"
            } text-white rounded-md p-1 px-2 mr-2`}
          >
            {item.change}%
          </span>
          <span className="text-text-light">

          {item.change > 0 ? "more" : "less"} than previous week
          </span>
        </span>
      </div>
    </div>
  );
};

export default Card;
