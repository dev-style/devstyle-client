"use server"

import { connectToDB } from "../lib/utils";
import OrderModel from "../models/order";

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

    return { count, orders };
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

    return {recentOrders};
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};