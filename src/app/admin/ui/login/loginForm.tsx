"use client";

import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState<string|null>(null);
  const router = useRouter()
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      console.log("username",username)
      console.log("password",password)
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        // Redirect or update state on successful login
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="flex items-center border-b-2 border-text-light py-2">
          <FaUser className="text-text-light mr-2" />
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="appearance-none bg-transparent border-none w-full text-text-light mr-3 py-1 px-2 leading-tight focus:outline-none"
            required
          />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center border-b-2 border-text-light py-2">
          <FaLock className="text-text-light mr-2" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="appearance-none bg-transparent border-none w-full text-text-light mr-3 py-1 px-2 leading-tight focus:outline-none"
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-primary w-full hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default LoginForm;
