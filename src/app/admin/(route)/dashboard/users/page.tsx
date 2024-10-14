import Link from "next/link";
import React from "react";
import Image from "next/image";
import Search from "@/app/admin/ui/dashboard/search/page";
import { fetchUsers } from "@/app/admin/controllers/user";

type Props = {};

const UsersPage = async ({ searchParams }: any) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const { count, users } = await fetchUsers(q, page);

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search for a user..." />
        <Link href="/admin/dashboard/users/add">
          <button className="p-2.5 bg-[#5d57c9] text-[var(--text)] border-none rounded cursor-pointer">
            Add New
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr>
              <td className="p-2.5">Avatar</td>
              <td className="p-2.5">Username</td>
              <td className="p-2.5">Email</td>
              <td className="p-2.5">Role</td>
              <td className="p-2.5">Phone</td>
              <td className="p-2.5">Address</td>
              <td className="p-2.5">Status</td>
              <td className="p-2.5">Actions</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2.5">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={user.avatar.url || "/noavatar.jpg"}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-2.5">{user.username}</td>
                <td className="p-2.5">{user.email}</td>
                <td className="p-2.5">{user.role}</td>
                <td className="p-2.5">{user.phone}</td>
                <td className="p-2.5">{user.address}</td>
                <td className="p-2.5">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-2.5">
                  <div className="flex gap-2.5">
                    <Link href={`/admin/dashboard/users/${user.id}`}>
                      <button className="px-2.5 py-1.5 text-[var(--text)] border-none rounded cursor-pointer bg-[teal]">
                        View
                      </button>
                    </Link>
                    <button className="px-2.5 py-1.5 text-[var(--text)] border-none rounded cursor-pointer bg-[crimson]">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
