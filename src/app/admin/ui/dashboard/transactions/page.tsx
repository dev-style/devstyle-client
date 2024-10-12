import { fetchRecentOrders } from "@/app/admin/controllers/order";
import Image from "next/image";
import React from "react";
import { IOrder } from "@/app/admin/lib/interfaces";

type Props = {};

const Transactions = async (props: Props) => {
  const { recentOrders } = await fetchRecentOrders();

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-5">
      <h2 className="mb-5 font-extralight text-[24px]">Latest Transactions</h2>
      <table className="w-full">
        <thead>
          <tr>
            <td className="p-2.5">Name</td>
            <td className="p-2.5">Status</td>
            <td className="p-2.5">Date</td>
            <td className="p-2.5">Amount</td>
          </tr>
        </thead>
        <tbody>
          {recentOrders.map((order: IOrder) => (
            <tr key={order._id?.toString()} className="hover:bg-[#2e374a]">
              <td className="p-2.5">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  {order.name}
                </div>
              </td>
              <td className="p-2.5">
                <span
                  className={`rounded-md p-1.5 text-sm ${
                    order.status === "processing"
                      ? "bg-[#f7cb7375] text-[#ffb42e]"
                      : order.status === "completed"
                      ? "bg-[#afd6ee75] text-[#3da5f4]"
                      : "bg-[#f7737375] text-[#ff0000]"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-2.5">{new Date(order.initDate).toLocaleDateString()}</td>
              <td className="p-2.5">{order.goodies.reduce((total, item) => total + item.total, 0)} CFA</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
