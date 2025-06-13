"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { storeSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersData, setOrdersData] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!storeSlug) return;

      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:3000/api/trpc/storefront.orders.getAll",
          {
            method: "GET",
            headers: {
              "x-store-slug": Array.isArray(storeSlug)
                ? storeSlug[0]
                : storeSlug,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        setOrdersData(data.result.data.json);
      } catch (error) {
        console.error("Error fetching orders:-", error);
        setError(
          error instanceof Error ? error.message : "unknown error occured"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [storeSlug]);
  return (
    <>
      <pre>{JSON.stringify(ordersData, null, 2)}</pre>
    </>
  );
}
