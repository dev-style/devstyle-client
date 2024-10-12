import React from "react";
import { cards } from "../../lib/data";
import Card from "../../ui/dashboard/card/page";
import Rightbar from "../../ui/dashboard/rightbar/page";
import Transactions from "../../ui/dashboard/transactions/page";
import Chart from "../../ui/dashboard/chart/page";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex gap-5 mt-5">
      <div className="flex-[3] flex flex-col gap-5">
        <div className="flex gap-5 justify-between">
          {cards && cards.map((item: any) => (
            item && item.id && item.title ? <Card item={item} key={item.id} /> : null
          ))}
        </div>
        <Transactions/>
        <Chart/>
      </div>

      <div className="flex-1">
        <Rightbar/>
      </div>
    </div>
  );
};

export default Page;
