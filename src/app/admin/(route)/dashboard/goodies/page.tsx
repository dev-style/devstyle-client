import Search from "@/app/admin/ui/dashboard/search/page";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { fetchGoodies } from "@/app/admin/controllers/goodie";
import Pagination from "@/app/admin/ui/dashboard/pagination/page";

type Props = {};

const GoodiesPage = async ({ searchParams }: any) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, goodies } = await fetchGoodies(q, page);

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search for a goodie..." />
        <Link href="/admin/dashboard/goodies/add">
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
              <td className="p-2.5">Name</td>
              <td className="p-2.5">Description</td>
              <td className="p-2.5">Collection</td>
              <td className="p-2.5">Price</td>
              <td className="p-2.5">Promo</td>
              <td className="p-2.5">Views</td>
              <td className="p-2.5">Sizes</td>
              <td className="p-2.5">Colors</td>
              <td className="p-2.5">Likes</td>
              <td className="p-2.5">Show</td>
            </tr>
          </thead>
          <tbody>
            {goodies.map((goodie) => (
              <tr key={goodie.id}>
                <td className="p-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={goodie.mainImage.url || "/nogoodie.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-2.5">{goodie.name}</td>
                <td className="p-2.5">
                  <div className="max-h-20 overflow-hidden max-w-[200px] overflow-y-auto">
                    {/* <div className="prose prose-sm">
                      {goodie.description.length > 100 ? (
                        <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: goodie.description.slice(0, 100) + "...",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: goodie.description,
                          }}
                        />
                      )}
                    </div> */}
                  </div>
                </td>
                <td className="p-2.5">{goodie.fromCollection.title}</td>
                <td className="p-2.5">{goodie.price} CFA</td>
                <td className="p-2.5">
                  {goodie.inPromo ? `${goodie.promoPercentage}%` : "No"}
                </td>
                <td className="p-2.5">{goodie.views}</td>
                <td className="p-2.5">
                  {goodie.sizes.map((s) => s.size).join(", ")}
                </td>
                <td className="p-2.5">
                  <span
                    title={`Available: ${goodie.availableColors.join(", ")}`}
                  >
                    {goodie.availableColors.length}
                  </span>
                  {" / "}
                  <span
                    title={`Background: ${goodie.backgroundColors.join(", ")}`}
                  >
                    {goodie.backgroundColors.length}
                  </span>
                </td>
                <td className="p-2.5">{goodie.likes}</td>
                <td className="p-2.5">{goodie.show ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination count={count} />
      </div>
    </div>
  );
};

export default GoodiesPage;
