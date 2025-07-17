"use client"
import Loading from "@/app/(protected)/loading";
import NotFound from "@/components/NotFound";
import { Restaurant } from "@/types/modelsTypes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const RestaurantPage = () => {

  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestoInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/r/${slug}`);

        if (!res.ok) {
          setNotFound(true); // sets notFound to trigger a 404
          return;
        }

        const data = await res.json();
        setRestaurant(data.restaurant);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        setNotFound(true); // fallback for network/server errors
        setLoading(false);
      }

    }

    fetchRestoInfo();
  }, [slug])
  
  if (loading) return <Loading />

  if (notFound) return <NotFound />

  return (
    <div>
      RestaurantPage {restaurant?.nom}
    </div>
  )
};

export default RestaurantPage
