import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-500 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">Prêt à transformer votre restaurant?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Contactez-nous pour découvrir comment MyResto peut vous aider à développer votre établissement
        </p>
        <Link href="/contact" className="inline-block bg-white text-blue-500 font-medium py-3 px-6 rounded-lg hover:bg-blue-500 hover:text-white hover:border-2 hover:border-white transition-all duration-300">Nous Contacter</Link>
        <p className="mt-4 text-blue-100">
          Notre équipe est à votre disposition pour répondre à toutes vos questions
        </p>
      </div>
    </section>
  );
};

export default CTASection;