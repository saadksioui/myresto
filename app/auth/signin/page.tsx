"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  if (res?.error) {
    setError(res.error);
  } else {
    // ✅ Sign-in successful
    router.push("/dashboard"); // or your dashboard route
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSignIn}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;