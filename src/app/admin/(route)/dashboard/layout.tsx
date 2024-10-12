import React from "react";
import Sidebar from "../../ui/dashboard/sidebar/sidebar";
import Navbar from "../../ui/dashboard/navbar/page";
import Footer from "../../ui/dashboard/footer/page";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className=" flex ">
      <div className="flex-1  bg-primary p-5 min-h-screen mx-auto ">
        <Sidebar />
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
