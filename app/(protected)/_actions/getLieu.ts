export const getLieu = async (id?: string) => {
  try {
const response = await fetch(`/api/restaurants/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch restaurant');
    }

    const data = await response.json();
    return data.lieux[0].lieu_id;
  } catch (error) {

  }
}