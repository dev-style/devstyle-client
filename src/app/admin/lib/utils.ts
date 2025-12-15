import mongoose from "mongoose";
import cloudinary from "cloudinary";

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

export const connectToDB = async () => {
  try {
    if (connection.isConnected) return;

    // Check if mongoose is already connected
    if (mongoose.connection.readyState === 1) {
      // console.log("MongoDB is already connected");
      connection.isConnected = mongoose.connection.readyState;
      return;
    }

    // If not connected, establish a new connection
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    // console.log("New MongoDB connection established");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    // console.log("connect error", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

// Ensure mongoose disconnects when the Node process ends
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// 

