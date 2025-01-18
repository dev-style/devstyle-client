import mongoose, { Model, Schema } from "mongoose";
import { IDiscount } from "../lib/interfaces";

export const DiscountSchema = new Schema<IDiscount>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    percent: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    limit: { type: Number, required: true },
    uses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DiscountModel: Model<IDiscount> =
  mongoose.models.Discount ||
  mongoose.model<IDiscount>("Discount", DiscountSchema);
export default DiscountModel;