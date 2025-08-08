import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-[#ebf0ff] text-blue-500 text-sm font-medium mb-6">
            Gestion des restaurants
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Votre restaurant en ligne <span className="text-blue-500">sans commission</span>
          </h1>

          <p className="text-xl text-gray-600 mb-12">
            Créez votre site de commande en ligne en quelques minutes, sans frais de commission.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={"/contact"}>
              <button className="cursor-pointer border-2 border-blue-500 text-blue-500 font-medium py-3 px-6 rounded-lg transition-all duration-300 inline-flex items-center justify-center">
                Nous Contacter
              </button>
            </Link>
            <Link href="/signin">
              <button className="cursor-pointer border-2 border-blue-500 bg-blue-500 hover:bg-blue-500/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">Manage your Restaurant</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
};

export default HeroSection
