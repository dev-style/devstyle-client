"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import uploadToCloudinary from "../lib/cloudinaryConfig";
import { ICloudinaryUploadResponse } from "../lib/interfaces";
import { connectToDB } from "../lib/utils";
import CollectionModel from "../models/collection";
import GoodieModel from "../models/goodie";
import SizeModel from "../models/size";

export const fetchGoodie = async (id: string) => {
  try {
    await connectToDB();
    const goodie = await GoodieModel.findById(id)
      .populate({
        path: "sizes",
        model: SizeModel,
      })
      .populate({
        path: "fromCollection",
        model: CollectionModel,
      })
      .lean();
    if (!goodie) {
      console.log("Goodie not found");
      return null;
    }
    // console.log("Goodie found:", goodie);
    return { goodie };
  } catch (error) {
    console.error("Error fetching goodie:", error);
    throw new Error(`Failed to fetch goodie: ${error.message}`);
  }
};

export const fetchGoodies = async (q: string, page: number) => {
  console.log("Query:", q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 15;

  try {
    await connectToDB();

    const count = await GoodieModel.find({
      name: { $regex: regex },
    }).countDocuments();

    const goodies = await GoodieModel.find({ name: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))
      .populate({
        path: "sizes",
        model: SizeModel,
      })
      .populate({
        path: "fromCollection",
        model: CollectionModel,
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Number of goodies found:", count);
    console.log("First goodie:", goodies[0]);

    if (!goodies || goodies.length === 0) {
      console.log("No goodies found");
      return { count: 0, goodies: [] };
    }

    return { count, goodies };
  } catch (err) {
    console.error("Error fetching goodies:", err);
    if (err instanceof Error) {
      throw new Error(`Failed to fetch goodies: ${err.message}`);
    } else {
      throw new Error("Failed to fetch goodies: Unknown error");
    }
  }
};

export const updateGoodie = async (id: string, data: any) => {
  console.log("goodie data to be updated", id, data);

  try {
    await connectToDB();

    // Upload main image and additional images concurrently
    const uploadPromises = [];
    let uploadedMainImage = {};

    // Check if mainImage is not a string to proceed with upload
    if (
      typeof data.mainImage == "string" &&
      data.mainImage.startsWith("data:image")
    ) {
      uploadPromises.push(
        uploader(data.mainImage).then((result: ICloudinaryUploadResponse) => {
          uploadedMainImage = {
            public_id: result.public_id,
            url: result.secure_url,
          };
        })
      );
    }

    const uploadedImages: { public_id: string; url: string }[] = [];
    if (data.images) {
      console.log("images exist:", data.images);
      uploadPromises.push(
        ...data.images.map((image: any) => {
          if (typeof image === "string" && image.startsWith("data:image")) {
            return uploader(image).then((result: ICloudinaryUploadResponse) => {
              uploadedImages.push({
                public_id: result.public_id,
                url: result.secure_url,
              });
            });
          }
          return Promise.resolve(); // Skip non-base64 strings
        })
      );
    }

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    console.log("mainImageResult", uploadedMainImage);
    console.log("uploadedImages", uploadedImages);

    // Generate unique slug
    // const collection = await CollectionModel.findById(data.fromCollection);

    // if (!collection) {
    //   throw new Error("Collection not found");
    // }

    // edit goodie feature
    const updateGoodie = await GoodieModel.findByIdAndUpdate(id, {
      name: data.name,
      description: data.description,
      fromCollection: data.fromCollection,
      price: data.price,
      inPromo: data.inPromo,
      promoPercentage: data.promoPercentage,
      sizes: data.sizes,
      availableColors: data.availableColors,
      backgroundColors: data.backgroundColors,
      show: data.show,
      views: data.views,
      likes: data.likes,
      etsy: data.etsy,
      // images: uploadedImages,
      ...(uploadedImages.length > 0 ? { images: uploadPromises } : {}),
      ...(Object.keys(uploadedMainImage).length > 0
        ? { mainImage: uploadedMainImage }
        : {}),
    });

    console.log("Goodie updated successfully:", updateGoodie);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to edit goodies: ${err.message}`);
    } else {
      throw new Error("Failed to edit goodies: Unknown error");
    }
  }

  revalidatePath("/admin/dashboard/goodies");
};

export const addGoodie = async (formData: any) => {
  const {
    name,
    description,
    fromCollection,
    price,
    inPromo,
    promoPercentage,
    sizes,
    availableColors,
    backgroundColors,
    show,
    views,
    likes,
    mainImage,
    images,
    etsy,
  } = formData;

  console.log("Données du goodie à envoyer:", {
    name,
    description,
    fromCollection,
    price,
    inPromo,
    promoPercentage,
    sizes,
    availableColors,
    backgroundColors,
    show,
    views,
    likes,
    etsy,
  });

  try {
    await connectToDB();

    // Upload main image and additional images sequentially to maintain order
    let uploadedMainImage = { public_id: "", url: "" };
    let uploadedImages = [];

    if (mainImage) {
      const result = await uploader(mainImage);
      uploadedMainImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    if (images) {
      console.log("les image existe :", images);
      for (const image of images) {
        const result = await uploader(image);
        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    console.log("mainImageResult", uploadedMainImage);
    console.log("uploadedImages", uploadedImages);

    // Generate unique slug
    const collection = await CollectionModel.findById(fromCollection);
    if (!collection) {
      throw new Error("Collection not found");
    }
    const slug = `${collection.slug}-${name
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    const newGoodie = new GoodieModel({
      name,
      description,
      slug,
      fromCollection,
      price: Number(price),
      inPromo,
      promoPercentage: promoPercentage ? Number(promoPercentage) : undefined,
      sizes: sizes,
      availableColors: (availableColors as string)
        .split(",")
        .map((color: string) => color.trim()),
      backgroundColors: (backgroundColors as string)
        .split(",")
        .map((color: string) => color.trim()),
      show,
      views: Number(views),
      likes: Number(likes),
      mainImage: uploadedMainImage,
      images: uploadedImages,
      etsy,
    });

    await newGoodie.save();
  } catch (err) {
    console.error("Error creating goodie:", err);
    throw new Error("Failed to create goodie!");
  }

  revalidatePath("/admin/dashboard/goodies");
  redirect("/admin/dashboard/goodies");
};

const uploader = async (path: any) =>
  await uploadToCloudinary(path, `DevStyle/Goodies`, {
    transformation: [
      {
        overlay: "devstyle_watermark",
        opacity: 10,
        gravity: "north_west",
        x: 5,
        y: 5,
        width: "0.5",
      },
      {
        overlay: "devstyle_watermark",
        opacity: 6.5,
        gravity: "center",
        width: "1.0",
        angle: 45,
      },
      {
        overlay: "devstyle_watermark",
        opacity: 10,
        gravity: "south_east",
        x: 5,
        y: 5,
        width: "0.5",
      },
    ],
  });
