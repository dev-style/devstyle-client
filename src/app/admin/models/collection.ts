import mongoose, { Model, Schema } from "mongoose";
import { ICollection } from "../lib/interfaces";

const collectionSchema: Schema<ICollection> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    colors: {
      type: String,
      required: true,
    },
    image: {
      public_id: String,
      url: String,
    },
    views: Number,
    show: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);


const CollectionModel: Model<ICollection> =mongoose.models.Collection || mongoose.model(
  "Collection",
  collectionSchema
);

export default CollectionModel;
