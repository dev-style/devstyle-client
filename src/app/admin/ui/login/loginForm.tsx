"use client";

import { FaUser, FaLock } from "react-icons/fa";
import { authentificate } from "../../controllers/user";
import { useState } from "react";

const LoginForm = () => {
  const [error, setError] = useState<string|null>(null);

  const handleSubmit = async (event:React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    try {
      const result = await authentificate(formData);
      console.log("result", result);
      if (result) {
        setError(result);
      } else {
        setError(null);
        // Handle successful login here (e.g., redirect)
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
