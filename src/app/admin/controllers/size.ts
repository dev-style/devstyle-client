"use server";

import { connectToDB } from "../lib/utils";
import SizeModel from "../models/size";
import { ObjectId } from "mongodb";

export async function fetchSizes() {
  try {
    await connectToDB();

    const sizes = await SizeModel.find({}).sort({ size: 1 });

    return {sizes}
  
  } catch (error) {
    console.error("Failed to fetch sizes:", error);
    throw new Error("Failed to fetch sizes. Please try again later.");
  }
}
