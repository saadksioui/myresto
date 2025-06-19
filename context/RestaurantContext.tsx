import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Restaurant {
  id: string;
  nom: string;
  type: string;
  slug: string;
  étape_configuration: number;
  logo_url?: string;
  bannière_url?: string;
  min_commande?: number;
  whatsapp_commande?: boolean;
  notifications_sonores?: boolean;
  abonnement?: {
    type: string;
    statut: string;
    date_fin: string;
  };
  profil?: {
    nom_gérant?: string;
    téléphone?: string;
    email?: string;
    langue?: string;
    facebook?: string;
    instagram?: string;
    site_web?: string;
  };
  rôle?: {
    nom: string;
    permissions: string[];
  };
}

interface RestaurantContextType {
  // State
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  selectedRestaurantId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setSelectedRestaurantId: (id: string | null) => void;
  fetchRestaurants: () => Promise<void>;
  createRestaurant: (data: { nom: string; type: string }) => Promise<Restaurant>;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<Restaurant>;
  deleteRestaurant: (id: string) => Promise<void>;
  refreshSelectedRestaurant: () => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get selected restaurant object
  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId) || null;

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }

      const data = await response.json();
      setRestaurants(data.restaurants || []);

      // If no restaurant is selected and we have restaurants, select the first one
      if (!selectedRestaurantId && data.restaurants?.length > 0) {
        setSelectedRestaurantIdState(data.restaurants[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new restaurant
  const createRestaurant = async (data: { nom: string; type: string }): Promise<Restaurant> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create restaurant');
      }

      const result = await response.json();
      const newRestaurant = result.restaurant;

      // Add to restaurants list
      setRestaurants(prev => [...prev, newRestaurant]);

      // Select the new restaurant
      setSelectedRestaurantIdState(newRestaurant.id);

      return newRestaurant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create restaurant');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a restaurant
  const updateRestaurant = async (id: string, data: Partial<Restaurant>): Promise<Restaurant> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update restaurant');
      }

      const result = await response.json();
      const updatedRestaurant = result.restaurant;

      // Update in restaurants list
      setRestaurants(prev =>
        prev.map(r => r.id === id ? { ...r, ...updatedRestaurant } : r)
      );

      return updatedRestaurant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update restaurant');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a restaurant
  const deleteRestaurant = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete restaurant');
      }

      // Remove from restaurants list
      setRestaurants(prev => prev.filter(r => r.id !== id));

      // If deleted restaurant was selected, clear selection
      if (selectedRestaurantId === id) {
        setSelectedRestaurantIdState(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete restaurant');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh selected restaurant data
  const refreshSelectedRestaurant = async (): Promise<void> => {
    if (!selectedRestaurantId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/restaurants/${selectedRestaurantId}`);
      if (!response.ok) {
        throw new Error('Failed to refresh restaurant data');
      }

      const data = await response.json();
      const refreshedRestaurant = data.restaurant;

      // Update in restaurants list
      setRestaurants(prev =>
        prev.map(r => r.id === selectedRestaurantId ? { ...r, ...refreshedRestaurant } : r)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh restaurant');
      console.error('Error refreshing restaurant:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set selected restaurant with persistence
  const setSelectedRestaurantId = (id: string | null) => {
    setSelectedRestaurantIdState(id);

    // Persist selection in localStorage
    if (id) {
      localStorage.setItem('selectedRestaurantId', id);
    } else {
      localStorage.removeItem('selectedRestaurantId');
    }
  };

  // Load persisted selection on mount
  useEffect(() => {
    const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
    if (savedRestaurantId) {
      setSelectedRestaurantIdState(savedRestaurantId);
    }
  }, []);

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const contextValue: RestaurantContextType = {
    // State
    restaurants,
    selectedRestaurant,
    selectedRestaurantId,
    loading,
    error,

    // Actions
    setSelectedRestaurantId,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    refreshSelectedRestaurant
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );

}
// Custom hook to use the restaurant context
export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};