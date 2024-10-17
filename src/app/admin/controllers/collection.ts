"use server";

import { connectToDB } from "../lib/utils";
import CollectionModel from "../models/collection";
import GoodieModel from "../models/goodie";
import { ObjectId } from "mongodb";

export async function fetchCollections() {
  try {
    await connectToDB();

    // Rename 'size' to 'sizes' in all Goodie documents
    await GoodieModel.updateMany(
      { size: { $exists: true } },
      { $rename: { "size": "sizes" } }
    );

    const collections = await CollectionModel.find({}).sort({ createdAt: -1 });

    return { collections };
  
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    throw new Error("Failed to fetch collections. Please try again later.");
  }
}
