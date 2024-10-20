import React from "react";
import { redirect } from "next/navigation";
import Sidebar from "../../ui/dashboard/sidebar/sidebar";
import Navbar from "../../ui/dashboard/navbar/page";
import Footer from "../../ui/dashboard/footer/page";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/admin/auth";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/admin/login");
  // }

  return (
    <div className="flex">
      <div className="flex-1 w-[300px] relative min-h-screen mx-auto">
        <div className="fixed w-[300px] h-full p-5">
          <Sidebar />
        </div>
      </div>
      <div className="flex-[5] p-5">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
