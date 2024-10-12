import mongoose, { Model, Schema } from "mongoose";
import { ISize } from "../lib/interfaces";

const sizeSchema = new Schema<ISize>(
  {
    size: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);


const SizeModel: Model<ISize> = mongoose.models.Size || mongoose.model("Size", sizeSchema);

export default SizeModel;
