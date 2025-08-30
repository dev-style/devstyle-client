require("dotenv").config();
import mongoose, { Model, Schema } from "mongoose";
import { IGoodie } from "../lib/interfaces";

const goodieSchema: Schema<IGoodie> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    fromCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    promoPercentage: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    inPromo: {
      type: Boolean,
      required: true,
    },
    views: {
      type: Number,
    },
    sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
        required: true,
      },
    ],
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    mainImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    availableColors: {
      type: [String],
      required: false,
    },
    backgroundColors: {
      type: [String],
      required: false,
    },

    likes: {
      type: Number,
    },
    show: {
      type: Boolean,
      default: false,
    },
    etsy: {
      type: String,
      required: false,
    },
  },

  { timestamps: true },
);

const GoodieModel: Model<IGoodie> =
  mongoose.models.Goodie || mongoose.model("Goodie", goodieSchema);

export default GoodieModel;
