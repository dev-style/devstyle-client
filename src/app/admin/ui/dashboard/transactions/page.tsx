import Image from "next/image";
import React from "react";

type Props = {};

const Transactions = (props: Props) => {
  return (
    <div className="bg-primary p-5 rounded-lg">
      <h2 className="text-text-light font-semibold mb-5">
        Latest Transactions
      </h2>
      <table className="w-full">
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Date</td>
            <td>Amount</td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="">
              <div className="flex gap-[10px] items-center">
                <Image
                  src="/noavatar.png"
                  alt=""
                  width={40}
                  height={40}
                  className="object-fill rounded-[50%]"
                />
                John Doe
              </div>
            </td>
            <td>
              <span className="rounded-sm p-[5px] text-[14px] text-text-light bg-warning">
                Pending
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className="flex gap-[10px] items-center">
                <Image
                  src="/noavatar.png"
                  alt=""
                  width={40}
                  height={40}
                  className="object-fill rounded-[50%]"
                />
                John Doe
              </div>
            </td>
            <td>
              <span className="rounded-sm p-[5px] text-[14px] text-text-light bg-success">
                Done
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className="flex gap-[10px] items-center">
                <Image
                  src="/noavatar.png"
                  alt=""
                  width={40}
                  height={40}
                  className="object-fill rounded-[50%]"
                />
                John Doe
              </div>
            </td>
            <td>
              <span className="rounded-sm p-[5px] text-[14px] text-text-light bg-danger">
                Cancelled
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className="flex gap-[10px] items-center">
                <Image
                  src="/noavatar.png"
                  alt=""
                  width={40}
                  height={40}
                  className="object-fill rounded-[50%]"
                />
                John Doe
              </div>
            </td>
            <td>
              <span className="rounded-sm p-[5px] text-[14px] text-text-light bg-warning">
                Pending
              </span>
            </td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
