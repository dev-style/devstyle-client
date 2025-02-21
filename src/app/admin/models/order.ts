require("dotenv").config();
import mongoose, { Model, Schema } from "mongoose";
import { IOrder } from "../lib/interfaces";

const orderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    goodies: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: "initiate",
      enum: ["initiate", "processing", "completed", "cancelled"],
    },
    email: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: false,
    },
    city:{
      type:String,
      required:true,
      
    },
    district:{
      type:String,
      required:false,
    },
    expeditionAdresse:{
      type:String,
      required:false,
    },

    paymentMethod:{
      type:String,
      required:true,
    },
 
    initDate: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const OrderModel: Model<IOrder> = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
