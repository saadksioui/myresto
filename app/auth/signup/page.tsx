"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          prénom: prenom,
          email,
          mot_de_passe: password
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Sign up failed");
        return;
      }

      setSuccess("Account created! Redirecting...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1500);
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-center">{success}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Nom</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={nom}
            onChange={e => setNom(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Prénom</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;