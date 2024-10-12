"use client";

import { fetchOrders } from "@/app/admin/controllers/order";
import Search from "@/app/admin/ui/dashboard/search/page";
import React, { useState, useEffect } from "react";
import {
  MdCheck,
  MdClose,
  MdAutorenew,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import Pagination from "@/app/admin/ui/dashboard/pagination/page";
import { updateOrderStatus } from "@/app/admin/lib/action";
import { ObjectId } from "mongoose";

type Order = {
  id: string;
  name: string;
  email: string;
  number?: number;
  status: "initiate" | "processing" | "completed" | "cancelled";
  initDate: string;
  goodies: [{ name: string; price: number; quantity: number; total: number }];
};

const OrdersPage = ({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [count, setCount] = useState(0);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = searchParams?.q || "";
        const page = parseInt(searchParams?.page || "1", 10);
        const { count, orders: fetchedOrders } = await fetchOrders(q, page);
        console.log("orders", orders);
        const formattedOrders: Order[] = fetchedOrders.map((order) => ({
          id: (order._id as ObjectId).toString(),
          name: order.name,
          email: order.email,
          number: order.number,
          status: order.status as
            | "initiate"
            | "processing"
            | "completed"
            | "cancelled",
          initDate: order.initDate.toISOString(),
          goodies: order.goodies,
        }));
        setOrders(formattedOrders);
        setCount(count);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
  }, [searchParams]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: "initiate" | "processing" | "completed" | "cancelled"
  ) => {
    try {
      await updateOrderStatus({ orderId, newStatus });
      // Refresh the orders after update
      const q = searchParams?.q || "";
      const page = parseInt(searchParams?.page || "1", 10);
      const { count, orders: updatedOrders } = await fetchOrders(q, page);

      const formattedOrders: Order[] = updatedOrders.map((order) => ({
        id: (order._id as ObjectId).toString(),
        name: order.name,
        email: order.email,
        number: order.number,
        status: order.status as
          | "initiate"
          | "processing"
          | "completed"
          | "cancelled",
        initDate: order.initDate.toISOString(),
        goodies: order.goodies,
      }));

      setOrders(formattedOrders);
      setCount(count);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initiate":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "";
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="bg-[var(--bgSoft)] p-5 rounded-lg mt-5">
      <div className="flex items-center justify-between mb-5">
        <Search placeholder="Search for an order..." />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr>
              <td className="p-2.5">Name</td>
              <td className="p-2.5">Email</td>
              <td className="p-2.5">Number</td>
              <td className="p-2.5">Status</td>
              <td className="p-2.5">Date</td>
              <td className="p-2.5">Total</td>
              <td className="p-2.5">Actions</td>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="border-b border-gray-200">
                  <td className="p-2.5">{order.name}</td>
                  <td className="p-2.5">{order.email}</td>
                  <td className="p-2.5">{order.number || "N/A"}</td>
                  <td className={`p-2.5 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </td>
                  <td className="p-2.5">
                    {new Date(order.initDate).toLocaleDateString()}
                  </td>
                  <td className="p-2.5">
                    {order.goodies.reduce(
                      (total, item) => total + item.total,
                      0
                    )}
                    CFA
                  </td>
                  <td className="p-2.5">
                    <div className="flex gap-2">
                      {order.status !== "completed" &&
                        order.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "processing")
                            }
                            className="p-1 bg-yellow-500 text-white rounded"
                            title="Process Order"
                          >
                            <MdAutorenew />
                          </button>
                        )}
                      {order.status === "processing" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(order.id, "completed")
                          }
                          className="p-1 bg-green-500 text-white rounded"
                          title="Complete Order"
                        >
                          <MdCheck />
                        </button>
                      )}
                      {order.status !== "cancelled" &&
                        order.status !== "completed" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order.id, "cancelled")
                            }
                            className="p-1 bg-red-500 text-white rounded"
                            title="Cancel Order"
                          >
                            <MdClose />
                          </button>
                        )}
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="p-1 bg-blue-500 text-white rounded"
                        title="Toggle Goodies"
                      >
                        {expandedOrder === order.id ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr>
                    <td colSpan={7} className="p-4 bg-[#151c2c] text-text-light">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {order.goodies.map((goodie, index) => (
                          <div
                            key={index}
                            className="bg-primary p-4 rounded-lg shadow"
                          >
                            <h3 className="font-bold text-lg mb-2">
                              {goodie.name}
                            </h3>
                            <p>Price: {goodie.price} CFA</p>
                            <p>Quantity: {goodie.quantity}</p>
                            <p className="font-semibold mt-2">
                              Total: {goodie.total} CFA
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <Pagination count={count} />
      </div>
    </div>
  );
};

export default OrdersPage;
