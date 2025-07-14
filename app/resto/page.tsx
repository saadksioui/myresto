"use client"
import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Phone,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Facebook,
  Instagram,
  Globe,
  Utensils,
  Truck,
  CreditCard,
  Banknote,
  X
} from 'lucide-react';

// Mock data for the restaurant
const mockRestaurantData = {
  restaurant: {
    id: "1",
    nom: "Bella Vista Italiana",
    type: "Italien",
    logo_url: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    bannière_url: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    profil: {
      nom_gérant: "Marco Rossi",
      téléphone: "+33 1 23 45 67 89",
      email: "contact@bellavista.fr",
      facebook: "bellavista.paris",
      instagram: "bellavista_paris",
      site_web: "https://bellavista.fr"
    },
    lieux: [{
      id: "1",
      nom: "Restaurant Principal",
      adresse: "123 Avenue des Champs-Élysées, 75008 Paris",
      whatsapp: "+33 6 12 34 56 78",
      horaires: [
        { jour_semaine: 1, activé: true, heure_ouverture: "11:30", heure_fermeture: "14:30" },
        { jour_semaine: 1, activé: true, heure_ouverture: "18:00", heure_fermeture: "23:00" },
        { jour_semaine: 2, activé: true, heure_ouverture: "11:30", heure_fermeture: "14:30" },
        { jour_semaine: 2, activé: true, heure_ouverture: "18:00", heure_fermeture: "23:00" },
        { jour_semaine: 3, activé: true, heure_ouverture: "11:30", heure_fermeture: "14:30" },
        { jour_semaine: 3, activé: true, heure_ouverture: "18:00", heure_fermeture: "23:00" },
        { jour_semaine: 4, activé: true, heure_ouverture: "11:30", heure_fermeture: "14:30" },
        { jour_semaine: 4, activé: true, heure_ouverture: "18:00", heure_fermeture: "23:00" },
        { jour_semaine: 5, activé: true, heure_ouverture: "11:30", heure_fermeture: "14:30" },
        { jour_semaine: 5, activé: true, heure_ouverture: "18:00", heure_fermeture: "23:30" },
        { jour_semaine: 6, activé: true, heure_ouverture: "18:00", heure_fermeture: "23:30" },
        { jour_semaine: 0, activé: false, heure_ouverture: "", heure_fermeture: "" }
      ]
    }],
    catégories: [
      {
        id: "1",
        nom: "Antipasti",
        description: "Entrées traditionnelles italiennes",
        menus: [
          {
            id: "1",
            nom: "Bruschetta Classique",
            description: "Pain grillé, tomates fraîches, basilic, ail et huile d'olive",
            prix: 8.50,
            image_url: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: [
              { nom: "Supplément mozzarella", prix_supplément: 2.00 },
              { nom: "Supplément jambon de Parme", prix_supplément: 3.50 }
            ]
          },
          {
            id: "2",
            nom: "Antipasto Misto",
            description: "Sélection de charcuteries, fromages et légumes marinés",
            prix: 14.90,
            image_url: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: []
          }
        ]
      },
      {
        id: "2",
        nom: "Pizzas",
        description: "Pizzas cuites au feu de bois",
        menus: [
          {
            id: "3",
            nom: "Pizza Margherita",
            description: "Sauce tomate, mozzarella di bufala, basilic frais",
            prix: 12.00,
            image_url: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: [
              { nom: "Pâte fine", prix_supplément: 0 },
              { nom: "Pâte épaisse", prix_supplément: 1.00 },
              { nom: "Supplément mozzarella", prix_supplément: 2.00 }
            ]
          },
          {
            id: "4",
            nom: "Pizza Quattro Stagioni",
            description: "Tomate, mozzarella, jambon, champignons, artichauts, olives",
            prix: 16.50,
            image_url: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: [
              { nom: "Pâte fine", prix_supplément: 0 },
              { nom: "Pâte épaisse", prix_supplément: 1.00 }
            ]
          },
          {
            id: "5",
            nom: "Pizza Diavola",
            description: "Sauce tomate, mozzarella, salami piquant, piments",
            prix: 15.00,
            image_url: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: []
          }
        ]
      },
      {
        id: "3",
        nom: "Pâtes",
        description: "Pâtes fraîches maison",
        menus: [
          {
            id: "6",
            nom: "Spaghetti Carbonara",
            description: "Œufs, pecorino, guanciale, poivre noir",
            prix: 13.50,
            image_url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: [
              { nom: "Supplément parmesan", prix_supplément: 1.50 }
            ]
          },
          {
            id: "7",
            nom: "Penne all'Arrabbiata",
            description: "Sauce tomate épicée, ail, piments, persil",
            prix: 11.50,
            image_url: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: []
          }
        ]
      },
      {
        id: "4",
        nom: "Desserts",
        description: "Douceurs italiennes",
        menus: [
          {
            id: "8",
            nom: "Tiramisu",
            description: "Le classique italien aux biscuits savoiardi et mascarpone",
            prix: 6.50,
            image_url: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: []
          },
          {
            id: "9",
            nom: "Panna Cotta",
            description: "Crème vanillée avec coulis de fruits rouges",
            prix: 5.50,
            image_url: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
            actif: true,
            options: [
              { nom: "Coulis fraise", prix_supplément: 0 },
              { nom: "Coulis fruits rouges", prix_supplément: 0 },
              { nom: "Coulis caramel", prix_supplément: 0.50 }
            ]
          }
        ]
      }
    ],
    paiement: {
      livraison: true,
      frais_livraison: 3.50,
      min_commande: 20.00,
      espèce: true,
      cb: true,
      paypal: false
    }
  }
};

interface CartItem {
  id: string;
  nom: string;
  prix: number;
  quantité: number;
  options: string[];
  prix_options: number;
}

const RestaurantPublicPage: React.FC = () => {
  const [restaurant] = useState(mockRestaurantData.restaurant);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const addToCart = (menu: any, selectedOptions: any[] = []) => {
    const prix_options = selectedOptions.reduce((sum, opt) => sum + opt.prix_supplément, 0);
    const cartItem: CartItem = {
      id: menu.id + '_' + Date.now(),
      nom: menu.nom,
      prix: menu.prix,
      quantité: 1,
      options: selectedOptions.map(opt => opt.nom),
      prix_options
    };

    setCart(prev => [...prev, cartItem]);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCart(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantité: newQuantity } : item
      ));
    }
  };

  const getTotalCart = () => {
    return cart.reduce((total, item) => total + (item.prix + item.prix_options) * item.quantité, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantité, 0);
  };

  const isRestaurantOpen = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const todayHours = restaurant.lieux[0]?.horaires.filter(h =>
      h.jour_semaine === currentDay && h.activé
    ) || [];

    return todayHours.some(h => {
      const openTime = parseInt(h.heure_ouverture.replace(':', ''));
      const closeTime = parseInt(h.heure_fermeture.replace(':', ''));
      return currentTime >= openTime && currentTime <= closeTime;
    });
  };

  const MenuCard: React.FC<{ menu: any }> = ({ menu }) => {
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    const handleAddToCart = () => {
      addToCart(menu, selectedOptions);
      setSelectedOptions([]);
      setShowOptions(false);
    };

    const toggleOption = (option: any) => {
      setSelectedOptions(prev => {
        const exists = prev.find(opt => opt.nom === option.nom);
        if (exists) {
          return prev.filter(opt => opt.nom !== option.nom);
        } else {
          return [...prev, option];
        }
      });
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-video relative">
          <img
            src={menu.image_url}
            alt={menu.nom}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
              {menu.prix.toFixed(2)}€
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{menu.nom}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{menu.description}</p>

          {menu.options && menu.options.length > 0 && (
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-blue-600 text-sm mb-3 hover:text-blue-700"
            >
              {showOptions ? 'Masquer les options' : 'Voir les options'}
            </button>
          )}

          {showOptions && menu.options && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Options:</h4>
              {menu.options.map((option: any, idx: number) => (
                <label key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOptions.some(opt => opt.nom === option.nom)}
                      onChange={() => toggleOption(option)}
                      className="mr-2"
                    />
                    <span className="text-sm">{option.nom}</span>
                  </div>
                  {option.prix_supplément > 0 && (
                    <span className="text-sm text-gray-600">+{option.prix_supplément.toFixed(2)}€</span>
                  )}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Ajouter au panier
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with banner */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.bannière_url}
          alt={restaurant.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={restaurant.logo_url}
              alt={restaurant.nom}
              className="w-16 h-16 rounded-full border-4 border-white object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{restaurant.nom}</h1>
              <p className="text-lg opacity-90">{restaurant.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{restaurant.lieux[0]?.adresse}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={16} />
              <span>{restaurant.profil?.téléphone}</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isRestaurantOpen() ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <Clock size={16} />
              <span>{isRestaurantOpen() ? 'Ouvert' : 'Fermé'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Restaurant info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Informations</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-gray-400" size={20} />
                      <span>{restaurant.lieux[0]?.adresse}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <span>{restaurant.profil?.téléphone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="text-gray-400" size={20} />
                      <span>
                        Livraison: {restaurant.paiement?.frais_livraison.toFixed(2)}€
                        {restaurant.paiement?.min_commande &&
                          ` (min. ${restaurant.paiement.min_commande.toFixed(2)}€)`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Horaires</h2>
                  <div className="space-y-1 text-sm">
                    {jours.map((jour, index) => {
                      const horaires = restaurant.lieux[0]?.horaires.filter(h =>
                        h.jour_semaine === index && h.activé
                      ) || [];

                      return (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{jour}:</span>
                          <span>
                            {horaires.length > 0
                              ? horaires.map(h => `${h.heure_ouverture}-${h.heure_fermeture}`).join(', ')
                              : 'Fermé'
                            }
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Suivez-nous:</span>
                  {restaurant.profil?.facebook && (
                    <a href={`https://facebook.com/${restaurant.profil.facebook}`}
                       className="text-blue-600 hover:text-blue-700">
                      <Facebook size={20} />
                    </a>
                  )}
                  {restaurant.profil?.instagram && (
                    <a href={`https://instagram.com/${restaurant.profil.instagram}`}
                       className="text-pink-600 hover:text-pink-700">
                      <Instagram size={20} />
                    </a>
                  )}
                  {restaurant.profil?.site_web && (
                    <a href={restaurant.profil.site_web}
                       className="text-gray-600 hover:text-gray-700">
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Menu categories */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === null
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tout voir
                </button>
                {restaurant.catégories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.nom}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-8">
              {restaurant.catégories
                .filter(category => !selectedCategory || category.id === selectedCategory)
                .map(category => (
                <div key={category.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.nom}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {category.menus
                      .filter(menu => menu.actif)
                      .map(menu => (
                        <MenuCard key={menu.id} menu={menu} />
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Panier</h3>
                  <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {getCartItemsCount()}
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Votre panier est vide</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.nom}</h4>
                            {item.options.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Options: {item.options.join(', ')}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              {(item.prix + item.prix_options).toFixed(2)}€
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantité - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantité}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantité + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Sous-total:</span>
                        <span>{getTotalCart().toFixed(2)}€</span>
                      </div>
                      {restaurant.paiement?.livraison && (
                        <div className="flex justify-between items-center mb-2">
                          <span>Livraison:</span>
                          <span>{restaurant.paiement.frais_livraison.toFixed(2)}€</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>
                          {(getTotalCart() + (restaurant.paiement?.frais_livraison || 0)).toFixed(2)}€
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors mt-4 flex items-center justify-center gap-2">
                      <ShoppingCart size={20} />
                      Commander
                    </button>

                    <div className="mt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2 mb-1">
                        <span>Paiement accepté:</span>
                        {restaurant.paiement?.espèce && <Banknote size={16} />}
                        {restaurant.paiement?.cb && <CreditCard size={16} />}
                      </div>
                      {restaurant.paiement?.min_commande &&
                        getTotalCart() < restaurant.paiement.min_commande && (
                        <p className="text-red-500">
                          Commande minimum: {restaurant.paiement.min_commande.toFixed(2)}€
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPublicPage;