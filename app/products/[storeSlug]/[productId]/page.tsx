"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductsDetailPage() {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { storeSlug, productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      console.log("i am here");
      if (!storeSlug || !productId) return;
      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:3000/api/trpc/public.product.getById",
          {
            method: "GET",
            headers: {
              "x-store-slug": Array.isArray(storeSlug)
                ? storeSlug[0]
                : storeSlug,
              "x-product-id": Array.isArray(productId)
                ? productId[0]
                : productId,
            },
          }
        );
        console.log(res);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched product details: ", data);

        if (data?.result?.data?.json) {
          setProductDetails(data.result.data.json);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching product details", err);
        setError(err instanceof Error ? err.message : "Unknown error occured");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, storeSlug]);

  return (
    <div>
      <div>{`${productId} : ${storeSlug}`}</div>
      <div>{JSON.stringify(productDetails, null, 2)}</div>
    </div>
  );
}
