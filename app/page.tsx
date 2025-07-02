import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Home = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to MyResto!</h1>
      <p className="mb-8 text-gray-600">Please sign in or sign up to continue.</p>
      <div className="flex gap-4">
        {session ? (
          <Link href="/dashboard">
            <button className="px-6 py-3 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition">
              Go to Dashboard
            </button>
          </Link>
        ) : (
          <>
            <Link href="/auth/signin">
              <button className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-6 py-3 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
