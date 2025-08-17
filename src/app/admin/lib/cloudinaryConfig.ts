require("dotenv").config();
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const uploadToCloudinary = (
  file: any,
  folder: any,
  optionsOnUpload = {},
) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: "auto",
        folder: folder,
        ...optionsOnUpload,
      },
      (error, result) => {
        resolve({
          url: result?.url,
          secure_url: result?.secure_url,
        });
      },
    );
  });
};

export const deleteImageFromCloudinary = (public_id: string) => {
  return new Promise((resolve, reject) => {
    console.log("publicId", public_id);
    cloudinary.v2.uploader.destroy(public_id, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
