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
      console.log("MongoDB is already connected");
      connection.isConnected = mongoose.connection.readyState;
      return;
    }

    // If not connected, establish a new connection
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("New MongoDB connection established");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("connect error", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

// Ensure mongoose disconnects when the Node process ends
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const uploadToCloudinary = (
  file: any,
  folder: string,
  optionsOnUpload = {}
): Promise<{ public_id: string; secure_url: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder: folder,
        ...optionsOnUpload,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
      }
    );
  });
};
