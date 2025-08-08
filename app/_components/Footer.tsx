import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-white">MyResto</span>
            </div>
            <p className="text-gray-400 mb-4">
              Solution moderne de gestion de restaurant qui simplifie les opérations et augmente l'efficacité.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://www.x.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="https://www.instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Tarifs</Link></li>
              {/* <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Multi-store</Link></li> */}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Centre d'aide</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Études de cas</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Nous contacter</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Se connecter</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {year} MyResto. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Conditions d'utilisation
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;