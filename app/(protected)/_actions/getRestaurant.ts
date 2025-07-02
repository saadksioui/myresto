

export const getRestaurants = async () => {
  try {
    const response = await fetch('/api/restaurants');

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
}

export const getRestaurant = async (id: string) => {
  try {
    const response = await fetch(`/api/restaurants/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch restaurant');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
  }
}