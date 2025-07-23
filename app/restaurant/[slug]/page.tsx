"use client"
import Loading from "@/app/(protected)/loading";
import NotFound from "@/components/NotFound";
import { Restaurant } from "@/types/modelsTypes";
import { Banknote, Clock, CreditCard, Facebook, Globe, Instagram, MapPin, Minus, Phone, Plus, ShoppingCart, Truck } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CartItem {
  id: string;
  menu_id: string;
  nom: string;
  prix: number;
  quantité: number;
  options: string[];
  prix_options: number;
}

const RestaurantPage = () => {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAdresse, setClientAdresse] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const addToCart = (menu: any, selectedOptions: any[] = []) => {
    const prix_options = selectedOptions.reduce((sum, opt) => sum + opt.prix_supplément, 0);
    const cartItem: CartItem = {
      id: `${menu.id}_${Date.now()}`,
      menu_id: menu.id,
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
    if (!restaurant) return false;

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

  useEffect(() => {
    const fetchRestoInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/r/${slug}`);

        if (!res.ok) {
          setNotFound(true);
          return;
        }

        const data = await res.json();
        setRestaurant(data.restaurant);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRestoInfo();
  }, [slug]);


  const submitOrder = async () => {
    if (!restaurant) return;

    if (!clientName.trim() || !clientPhone.trim() || !clientAdresse.trim() || !clientEmail.trim()) {
      setOrderError("Veuillez saisir votre nom, email, téléphone et votre adresse.");
      return;
    }

    setIsSubmitting(true);
    setOrderError("");

    try {
      // Step 1: Create the client
      const clientResponse = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom: clientName.trim(),
          téléphone: clientPhone.trim(),
          adresse: clientAdresse.trim(),
          email: clientEmail.trim()
        })
      });

      const clientData = await clientResponse.json();
      console.log("Client creation response:", clientData);

      if (!clientResponse.ok) {
        throw new Error(clientData.error || "Erreur lors de la création du client");
      }

      const clientId = clientData.client?.id;

      if (!clientId) {
        throw new Error("client_id est manquant dans la réponse");
      }

      // Step 2: Create the order
      const orderData = {
        client_id: clientId,
        détails: cart.map(item => ({
          menu_id: item.menu_id,
          quantité: item.quantité,
          options: item.options,
          notes: ""
        })),
        frais_livraison: restaurant.paiement?.frais_livraison || 0,
        notes: orderNotes,
        mode_paiement: "espèce"
      };

      console.log("Submitting order data:", orderData);

      const response = await fetch(`/api/r/${slug}/commande`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const responseData = await response.json();
      console.log("Order response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Erreur lors de la commande");
      }

      setOrderSuccess(true);
      setCart([]);
      setClientName("");
      setClientPhone("");
      setClientAdresse("");
      setClientEmail("");
      setOrderNotes("");

      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (error: any) {
      console.error("Order submission error:", error);
      setOrderError(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };



  if (loading) return <Loading />;
  if (notFound) return <NotFound />;

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
            src={menu.image_url || '/placeholder.png'}
            alt={menu.nom}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-900">
              {parseFloat(menu.prix).toFixed(2)}Dhs
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
                  {Number(option.prix_supplément) > 0 && (
                    <span className="text-sm text-gray-600">+{Number(option.prix_supplément).toFixed(2)}Dhs</span>
                  )}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
          src={restaurant?.bannière_url || '/banner.png'}
          alt={restaurant?.nom || 'Restaurant Banner'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-4 mb-2">
            <Image
              src={restaurant?.logo_url || '/placeholder-restaurant.png'}
              alt={restaurant?.nom || 'Restaurant Logo'}
              className="w-16 h-16 rounded-full border-4 border-white object-cover"
              width={64}
              height={64}
            />
            <div>
              <h1 className="text-3xl font-bold">{restaurant?.nom}</h1>
              <p className="text-lg opacity-90">{restaurant?.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{restaurant?.lieux[0]?.adresse}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={16} />
              <span>{restaurant?.profil?.téléphone}</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isRestaurantOpen() ? 'bg-green-500' : 'bg-red-500'
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
                      <span>{restaurant?.lieux[0]?.adresse}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={20} />
                      <span>{restaurant?.profil?.téléphone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="text-gray-400" size={20} />
                      <span>
                        Livraison: {Number(restaurant?.paiement?.frais_livraison).toFixed(2)}Dhs
                        {restaurant?.paiement?.min_commande &&
                          ` (min. ${Number(restaurant?.paiement?.min_commande).toFixed(2)}Dhs)`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Horaires</h2>
                  <div className="space-y-1 text-sm">
                    {jours.map((jour, index) => {
                      const horaires = restaurant?.lieux[0]?.horaires.filter(h =>
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
                  {restaurant?.profil?.facebook && (
                    <a href={`https://facebook.com/${restaurant?.profil.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700">
                      <Facebook size={20} />
                    </a>
                  )}
                  {restaurant?.profil?.instagram && (
                    <a href={`https://instagram.com/${restaurant?.profil.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700">
                      <Instagram size={20} />
                    </a>
                  )}
                  {restaurant?.profil?.site_web && (
                    <a href={restaurant?.profil.site_web}
                      target="_blank"
                      rel="noopener noreferrer"
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
                  className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Tout voir
                </button>
                {restaurant?.catégories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
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
              {restaurant?.catégories
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
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
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
                              {Number(item.prix + item.prix_options).toFixed(2)}Dhs
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

                    {/* Client Information */}
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Vos informations</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Votre nom"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Téléphone"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          placeholder="Adresse"
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          value={clientAdresse}
                          onChange={(e) => setClientAdresse(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Notes de commande</h4>
                      <textarea
                        placeholder="Instructions spéciales, allergies, etc."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Sous-total:</span>
                        <span>{getTotalCart().toFixed(2)}Dhs</span>
                      </div>
                      {restaurant?.paiement?.livraison && (
                        <div className="flex justify-between items-center mb-2">
                          <span>Livraison:</span>
                          <span>{Number(restaurant?.paiement?.frais_livraison || 0).toFixed(2)}Dhs</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>
                          {(getTotalCart() + Number(restaurant?.paiement?.frais_livraison || 0)).toFixed(2)}Dhs
                        </span>
                      </div>
                    </div>

                    {/* Order Error/Success Messages */}
                    {orderError && (
                      <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {orderError}
                      </div>
                    )}
                    {orderSuccess && (
                      <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                        Commande passée avec succès!
                      </div>
                    )}

                    <button
                      onClick={submitOrder}
                      disabled={isSubmitting}
                      className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white py-3 px-4 rounded-lg transition-colors mt-4 flex items-center justify-center gap-2`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          En cours...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={20} />
                          Commander
                        </>
                      )}
                    </button>

                    <div className="mt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2 mb-1">
                        <span>Paiement accepté:</span>
                        {restaurant?.paiement?.espèce && <Banknote size={16} />}
                        {restaurant?.paiement?.cb && <CreditCard size={16} />}
                      </div>
                      {restaurant?.paiement?.min_commande &&
                        getTotalCart() < Number(restaurant?.paiement.min_commande) && (
                          <p className="text-red-500">
                            Commande minimum: {Number(restaurant?.paiement.min_commande).toFixed(2)}Dhs
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
  )
};

export default RestaurantPage