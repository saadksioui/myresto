"use client"
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <nav className="fixed w-full z-50 bg-white py-4 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-500">MyResto</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Fonctionnalités</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Tarifs</Link>
            {/* <Link href="#testimonials" className="text-gray-600 hover:text-gray-900">Multi-store</Link> */}
            <Link href="/contact"><button className="text-gray-900 font-medium">Nous Contacter</button></Link>
            <Link href="/signin">
              <button className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-500/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">Manage your Restaurant</button>
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <Link href="#features" className="block px-4 py-2 text-gray-600 hover:text-gray-900">Fonctionnalités</Link>
            <Link href="#pricing" className="block px-4 py-2 text-gray-600 hover:text-gray-900">Tarifs</Link>
            {/* <Link href="#testimonials" className="block px-4 py-2 text-gray-600 hover:text-gray-900">Multi-store</Link> */}
            <div className="px-4 pt-2 space-y-2">
              <Link href="/contact"><button className="text-gray-900 font-medium">Nous Contacter</button></Link>
              <Link href="/signin">
                <button className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-500/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">Manage your Restaurant</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
};

export default Navbar
