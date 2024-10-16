"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRef, useState } from "react";
import { addUser } from "@/app/admin/controllers/user";
import { IUser } from "@/app/lib/interfaces";

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().optional(),
  role: z.enum(["user", "admin"]),
  isActive: z.boolean(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

const AddUserPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "user",
      isActive: true,
    },
  });

  const onSubmit = async (data: any) => {
    await addUser(data);
  };

  const imageInputRef = useRef<HTMLInputElement>(null);

  const imageFile = watch("avatar");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64img = reader.result as string;
        setValue("avatar", base64img);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-primary p-8 rounded-lg mt-5 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-left text-[var(--text)]">
        Add New User
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Username"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="password"
                  placeholder="Password"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            />
          </div>

          <div>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="tel"
                  placeholder="Phone"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Address"
                  className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              )}
            />
          </div>

          <div className="flex items-center">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="checkbox"
                  id="isActive"
                  className="mr-2 h-5 w-5"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label htmlFor="isActive" className="text-[var(--text)]">
              Active User
            </label>
          </div>
        </div>

        <div className=" space-y-4">
          <div className="flex flex-col">
            <label htmlFor="image" className="mb-2 text-[var(--text)]">
              Avatar image
            </label>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { value, ...field } }) => (
                <div className="w-full p-4 bg-[var(--bg)] text-[var(--text)] border-2 border-[#2e374a] rounded-lg focus-within:ring-2 focus-within:ring-teal-500">
                  <input
                    {...field}
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={imageInputRef}
                  />
                  <label
                    htmlFor="avatar"
                    className="cursor-pointer flex justify-center items-center"
                  >
                    {imageFile ? (
                      <img
                        src={imageFile}
                        alt="avatar"
                        className="max-w-full max-h-40 object-cover"
                      />
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <p>Click to upload avatar image</p>
                      </div>
                    )}
                  </label>
                </div>
              )}
            />
          </div>
          {errors.avatar && (
            <p className="text-red-500">{errors.avatar.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-4 bg-teal-500 text-white font-bold border-none rounded-lg cursor-pointer hover:bg-teal-600 transition duration-300"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUserPage;
