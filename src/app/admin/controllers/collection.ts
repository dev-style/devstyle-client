"use server";

import { connectToDB } from "../lib/utils";
import CollectionModel from "../models/collection";
import { ObjectId } from "mongodb";

export async function fetchCollections() {
  try {
    await connectToDB();

    const collections = await CollectionModel.find({}).sort({ size: 1 });

    return {collections}
  
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw new Error("Failed to fetch collections. Please try again later.");
  }
}
