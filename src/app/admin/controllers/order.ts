"use server";

import { connectToDB } from "../lib/utils";
import OrderModel from "../models/order";
import GoodieModel from "../models/goodie";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SizeModel from "../models/size";
export const fetchOrders = async (q: string, page: number) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 10;

  try {
    await connectToDB();

    const query = {
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
        { status: { $regex: regex } },
      ],
    };

    const count = await OrderModel.countDocuments(query);

    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * ITEM_PER_PAGE)
      .limit(ITEM_PER_PAGE)
      .lean(); // Use lean() to return plain JavaScript objects instead of Mongoose documents

    // fetch goodie details and sizes for each order's goodies
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedGoodies = await Promise.all(
          order.goodies.map(async (goodie) => {
            // Fetch goodie details from GoodieModel
            // Assuming GoodieModel is imported and has the necessary schema
            const goodieDetails = await GoodieModel.findById(goodie._id).lean();
            const sizeDetails = await SizeModel.findById(goodie.size).lean();
            return {
              ...goodie,
              slug: goodieDetails ? goodieDetails.slug : "",
              sizeName: sizeDetails ? sizeDetails.size : "",
              _id: goodie._id?.toString(),
              size: goodie.size?.toString(),
            };
          })
        );
        return {
          ...order,
          goodies: detailedGoodies,
        };
      })
    );
    
    // console.log("Fetched orders:", detailedOrders[0].goodies);
    return { count, orders: detailedOrders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const fetchRecentOrders = async () => {
  try {
    await connectToDB();

    const recentOrders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)

      .lean();

    return { recentOrders };
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (formData: any) => {
  const { orderId, newStatus } = formData;
  console.log("valeur a changer", orderId, newStatus);
  try {
    await connectToDB();

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus }, // Changed 'newStatus' to 'status' to match the schema
      { new: true, lean: true } // Added 'lean: true' to return a plain JavaScript object
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    console.log("Order updated successfully:", updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    throw new Error("Failed to update order!");
  }

  revalidatePath("/admin/dashboard/orders");
  redirect("/admin/dashboard/orders");
};

export const fetchMonthlySales = async () => {

  

  try {
    await connectToDB();

    const monthlySales = await OrderModel.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $unwind: "$goodies"
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: { $multiply: ["$goodies.price", "$goodies.quantity"] } }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Jan" },
                { case: { $eq: ["$_id", 2] }, then: "Feb" },
                { case: { $eq: ["$_id", 3] }, then: "Mar" },
                { case: { $eq: ["$_id", 4] }, then: "Apr" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "Jun" },
                { case: { $eq: ["$_id", 7] }, then: "Jul" },
                { case: { $eq: ["$_id", 8] }, then: "Aug" },
                { case: { $eq: ["$_id", 9] }, then: "Sep" },
                { case: { $eq: ["$_id", 10] }, then: "Oct" },
                { case: { $eq: ["$_id", 11] }, then: "Nov" },
                { case: { $eq: ["$_id", 12] }, then: "Dec" }
              ],
              default: "Unknown"
            }
          },
          sales: 1
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return monthlySales;
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    throw error;
  }
};

export const fetchMonthlyOrderStats = async () => {
  try {
    await connectToDB();

    const monthlyOrderStats = await OrderModel.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalOrders: { $sum: 1 },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
            }
          },
          cancelledOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" }
              ],
              default: "Unknown"
            }
          },
          year: "$_id.year",
          totalOrders: 1,
          completedOrders: 1,
          cancelledOrders: 1
        }
      },
      { $sort: { year: 1, "_id.month": 1 } }
    ]);

    return monthlyOrderStats;
  } catch (error) {
    console.error("Error fetching monthly order stats:", error);
    throw error;
  }
};

export const fetchSalesVsOrders = async () => {
  try {
    const salesVsOrdersData = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          sales: {
            $sum: {
              $reduce: {
                input: "$goodies",
                initialValue: 0,
                in: { $add: ["$$value", { $multiply: ["$$this.price", "$$this.quantity"] }] }
              }
            }
          },
          orders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                { case: { $eq: ["$_id.month", 12] }, then: "Dec" }
              ],
              default: "Unknown"
            }
          },
          year: "$_id.year",
          sales: 1,
          orders: 1
        }
      },
      { $sort: { year: 1, "_id.month": 1 } }
    ]);

    return salesVsOrdersData;
  } catch (error) {
    console.error("Error fetching sales vs orders data:", error);
    throw error;
  }
};

export const fetchTopSellingGoodies = async () => {
  try {
    await connectToDB();

    const topSellingGoodies = await OrderModel.aggregate([
      {
        $match: { status: "completed" }
      },
      {
        $unwind: "$goodies"
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            goodieName: "$goodies.name"
          },
          totalQuantity: { $sum: "$goodies.quantity" },
          totalSales: { $sum: { $multiply: ["$goodies.price", "$goodies.quantity"] } }
        }
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            goodieName: "$_id.goodieName"
          },
          monthlyData: {
            $push: {
              month: "$_id.month",
              quantity: "$totalQuantity",
              sales: "$totalSales"
            }
          },
          totalQuantity: { $sum: "$totalQuantity" },
          totalSales: { $sum: "$totalSales" }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          totalQuantity: -1
        }
      },
      {
        $group: {
          _id: "$_id.year",
          topGoodies: {
            $push: {
              name: "$_id.goodieName",
              totalQuantity: "$totalQuantity",
              totalSales: "$totalSales",
              monthlyData: "$monthlyData"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id",
          topGoodies: { $slice: ["$topGoodies", 5] }
        }
      },
      {
        $sort: { year: -1 }
      }
    ]);

    return topSellingGoodies;
  } catch (error) {
    console.error("Error fetching top selling goodies:", error);
    throw error;
  }
};
