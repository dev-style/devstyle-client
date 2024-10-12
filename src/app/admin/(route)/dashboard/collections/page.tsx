import Search from "@/app/admin/ui/dashboard/search/page";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { fetchCollections } from "@/app/admin/controllers/collection";

type Props = {};

const CollectionsPage = async ({ searchParams }: any) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, collections } = await fetchCollections(q, page);

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search for a collection..." />
        <Link href="/admin/dashboard/collections/add">
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
              <td className="p-2.5">Slug</td>
              <td className="p-2.5">Colors</td>
              <td className="p-2.5">Views</td>
              <td className="p-2.5">Show</td>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td className="p-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={collection.image.url || "/nocollection.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-2.5">{collection.title}</td>
                <td className="p-2.5">{collection.slug}</td>
                <td className="p-2.5">{collection.colors}</td>
                <td className="p-2.5">{collection.views}</td>
                <td className="p-2.5">{collection.show ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionsPage;
