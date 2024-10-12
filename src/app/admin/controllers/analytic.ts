"use server"

import { connectToDB } from "../lib/utils";
import GoodieModel from "../models/goodie";

export const fetchGoodiesByCollection = async () => {
  try {
    await connectToDB();

    const goodiesByCollection = await GoodieModel.aggregate([
      {
        $group: {
          _id: "$collection",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$count"
        }
      },
      {
        $sort: { value: -1 }
      }
    ]);

    return goodiesByCollection;
  } catch (error) {
    console.error("Error fetching goodies by collection:", error);
    throw error;
  }
};
