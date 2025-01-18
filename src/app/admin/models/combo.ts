import mongoose, { Schema, Document, Model } from "mongoose";
import { ICombo } from "../lib/interfaces";



const ComboSchema = new Schema<ICombo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    inPromo: { type: Boolean, default: false },
    promoPercentage: { type: Number },
    items: [{ type: Schema.Types.ObjectId, ref: "Goodie", required: true }],
    mainImage: { type: String, required: true },
    images: [{ type: String }],
    availableColors: [{ type: String }],
    backgroundColors: [{ type: String }],
  },
  { timestamps: true }
);

const ComboModel: Model<ICombo> =
  mongoose.models.Combo || mongoose.model<ICombo>("Combo", ComboSchema);

export default ComboModel;
