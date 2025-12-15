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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Goodie",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        size: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Size",
          required: false,
        },
        color: {
          type: String,
          required: false,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
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
