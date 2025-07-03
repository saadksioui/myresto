"use client"
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const Etape2Form = ({
  onSuccess,
  restaurantId,
}: {
  onSuccess: () => void;
  restaurantId: string;
}) => {
  // const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState("MA (+212)");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  /* const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null); */

  /* // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      initMap();
      initAutocomplete();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      initMap();
      initAutocomplete();
    };
    document.body.appendChild(script);
    // eslint-disable-next-line
  }, []);

  // Initialize map and marker
  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    const defaultPosition = { lat: 33.5731, lng: -7.5898 }; // Casablanca by default
    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultPosition,
      zoom: 12,
    });

    markerRef.current = new window.google.maps.Marker({
      position: defaultPosition,
      map,
      draggable: true,
    });

    setLat(defaultPosition.lat);
    setLng(defaultPosition.lng);

    map.addListener("click", (e: any) => {
      markerRef.current.setPosition(e.latLng);
      setLat(e.latLng.lat());
      setLng(e.latLng.lng());
    });

    markerRef.current.addListener("dragend", (e: any) => {
      setLat(e.latLng.lat());
      setLng(e.latLng.lng());
    });
  };

  // Initialize address autocomplete
  const initAutocomplete = () => {
    if (!autocompleteRef.current || !window.google) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ["geocode"] }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) setAddress(place.formatted_address);
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLat(lat);
        setLng(lng);
        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
          markerRef.current.getMap().setCenter({ lat, lng });
        }
      }
    });
  };

  const handleConfirmAddress = () => {
    if (!window.google || !address) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        setLat(location.lat());
        setLng(location.lng());
        if (markerRef.current) {
          markerRef.current.setPosition(location);
          markerRef.current.getMap().setCenter(location);
        }
      } else {
        setError("Adresse introuvable.");
      }
    });
  }; */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          étape: 2,
          adresse: address,
          téléphone: whatsappNumber,
          whatsapp_commande: false,
        }),
      });

      let data = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.warn("Invalid or empty JSON response");
      }

      if (!res.ok) {
        setError(data?.message || "Erreur lors de l'enregistrement");
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Network or server error:", err);
      setError("Erreur inattendue, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Étape 2 sur 3</span>
        <span className="w-1/3 h-2 bg-red-500 rounded-full" style={{ width: "67%" }} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Étape 2 : Localisations et WhatsApp</h2>
      {/* <input type="text"
        placeholder="Nom de l'emplacement"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        value={locationName}
        onChange={e => setLocationName(e.target.value)}
        required
      /> */}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">
          Adresse du restaurant
        </label>
        <input
          type="text"
          placeholder="Tapez votre adresse"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          value={address}
          onChange={e => setAddress(e.target.value)}
          autoComplete="off"
        />
        {/* button
          type="button"
          className="mt-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={handleConfirmAddress}
        >
          Confirmer l'adresse sur la carte
        </*button>*/}
      </div>
      {/*<div>
        <label className="block mb-2 text-gray-700 font-medium">
          <span className="inline-flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#555" /></svg>
            Localisation du restaurant
          </span>
        </label>
        <div ref={mapRef} className="w-full h-64 rounded border" />
        {lat && lng && (
          <div className="mt-2 text-sm text-gray-600">
            Latitude: {lat}, Longitude: {lng}
          </div>
        )}
      </div>*/}
      <div>
        <label className="block mb-2 text-gray-700 font-medium">
          <span className="inline-flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" fill="#555" /></svg>
            Numéro WhatsApp
          </span>
        </label>
        <div className="flex gap-2">
          <select
            className="px-2 py-2 border rounded focus:outline-none"
            value={whatsappCountry}
            onChange={e => setWhatsappCountry(e.target.value)}
          >
            <option value="MA (+212)">MA (+212)</option>
            <option value="FR (+33)">FR (+33)</option>
            <option value="US (+1)">US (+1)</option>
          </select>
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="0612345678"
            value={whatsappNumber}
            onChange={e => setWhatsappNumber(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Suivant"}
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default Etape2Form;
