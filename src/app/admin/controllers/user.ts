"use server";

import { revalidatePath } from "next/cache";
import { IUser } from "../lib/interfaces";
import { connectToDB } from "../lib/utils";
import UserModel from "../models/user";
import { redirect } from "next/navigation";
import uploadToCloudinary from "../lib/cloudinaryConfig";
import bcrypt from "bcrypt";
import { signIn } from "next-auth/react";

export const fetchUsers = async (q: string, page: number) => {
  console.log(q);
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 10;
  try {
    await connectToDB();

    const count = await UserModel.find({
      username: { $regex: regex },
    }).countDocuments();
    const users = await UserModel.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    console.log("list of users", users);
    return { count, users };
  } catch (err) {
    console.log("Error fetching users:", err);
    throw new Error("Failed to fetch users!");
  }
};

export const addUser = async (user: IUser) => {
  const { username, email, password, avatar, role, isActive, phone, address } =
    user;

  console.log(
    "username , email , password , avatar , role , isActive , phone , address",
    username,
    email,
    password,
    avatar,
    role,
    isActive,
    phone,
    address
  );

  try {
    await connectToDB();

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    let uploadedImage = { public_id: "", url: "" };
    if (avatar) {
      const imageResult = await uploadToCloudinary(avatar, "DevStyle/Avatar");
      uploadedImage = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
      };
    }

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      avatar: uploadedImage,
      role,
      isActive,
      phone,
      address,
    });

    await newUser.save();
  } catch (err) {
    console.log("err", err);
    throw new Error("Failed to create user");
  }

  revalidatePath("/admin/dashboard/users");
  redirect("/admin/dashboard/users");
};

// export const authentificate = async (formData:FormData) => {
//   const { username, password } = Object.fromEntries(formData);

//   console.log("username , password", username, password);

//   try {
//     await signIn("credentials", { username, password ,redirect:false});
//   } catch (err: any) {
//     if (err.message.includes("CredentialsSignin")) {
//       return "Wrong Credentials";
//     }
//     throw err;
//   }
// };
