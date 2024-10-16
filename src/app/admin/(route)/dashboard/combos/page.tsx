import Search from "@/app/admin/ui/dashboard/search/page";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Pagination from "@/app/admin/ui/dashboard/pagination/page";
import { fetchCombos } from "@/app/admin/controllers/combo";
import { ICombo } from "@/app/admin/lib/interfaces";

type Props = {};

const CombosPage = async ({ searchParams }: any) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, combos } = await fetchCombos(q, page);

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search for a combo..." />
        <Link href="/admin/dashboard/combos/add">
          <button className="p-2.5 bg-[#5d57c9] text-[var(--text)] border-none rounded cursor-pointer">
            Add New
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr>
              <td className="p-2.5">Image</td>
              <td className="p-2.5">Title</td>
              <td className="p-2.5">Description</td>
              <td className="p-2.5">Price</td>
              <td className="p-2.5">Promo</td>
              <td className="p-2.5">Items</td>
              <td className="p-2.5">Colors</td>
            </tr>
          </thead>
          <tbody>
            {combos.map((combo: ICombo) => (
              <tr key={combo.id}>
                <td className="p-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={combo.mainImage || "/nocombo.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-2.5">{combo.title}</td>
                <td className="p-2.5">{combo.description}</td>
                <td className="p-2.5">{combo.price} CFA</td>
                <td className="p-2.5">
                  {combo.inPromo ? `${combo.promoPercentage}%` : "No"}
                </td>
                <td className="p-2.5">{combo.items.length}</td>
                <td className="p-2.5">
                  <span
                    title={`Available: ${combo.availableColors.join(", ")}`}
                  >
                    {combo.availableColors.length}
                  </span>
                  {" / "}
                  <span
                    title={`Background: ${combo.backgroundColors.join(", ")}`}
                  >
                    {combo.backgroundColors.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination count={count} />
      </div>
    </div>
  );
};

export default CombosPage;
