require("dotenv").config();
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const uploader = async (path: any) =>
  await uploadToCloudinary(path, `DevStyle/Goodies`, {
    transformation: [
      {
        overlay: "devstyle_watermark",
        opacity: 10,
        gravity: "north_west",
        x: 5,
        y: 5,
        width: "0.4",
      },
      {
        overlay: "devstyle_watermark",
        opacity: 4.5,
        gravity: "center",
        width: "0.5",
        angle: 45,
      },
      {
        overlay: "devstyle_watermark",
        opacity: 10,
        gravity: "south_east",
        x: 5,
        y: 5,
        width: "0.4",
      },
    ],
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
