"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Share,
  ArrowLeft,
} from "lucide-react";
import superjson from "superjson";

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: string;
  createdAt: string;
  inStock: boolean;
}

export default function ProductsDetailPage() {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { storeSlug, productId } = useParams();

  // useEffect(() => {
  //   const fetchProductDetails = async () => {
  //     console.log("i am here");
  //     if (!storeSlug || !productId) return;

  //     try {
  //       setLoading(true);

  //       // const url = `http://localhost:3000/api/trpc/public.product.getById?batch=1&input=${encodeURIComponent(
  //       //   JSON.stringify({ id: productId })
  //       // )}`;

  //       // const url = `http://localhost:3000/api/trpc/public.product.getById?batch=1&input=${encodeURIComponent(
  //       //   JSON.stringify([{ id: productId }])
  //       // )}`;

  //       // const res = await fetch(url, {
  //       //   method: "GET",
  //       //   headers: {
  //       //     "x-store-slug": Array.isArray(storeSlug) ? storeSlug[0] : storeSlug,
  //       //     "x-product-id": Array.isArray(productId) ? productId[0] : productId,
  //       //   },
  //       //   // body: JSON.stringify({ id: productId }),
  //       // });
  //       const url = `http://localhost:3000/api/trpc/public.product.getById?input=${encodeURIComponent(
  //         JSON.stringify({ id: productId })
  //       )}`;
  //       const res = await fetch(url, {
  //         headers: {
  //           "x-store-slug": Array.isArray(storeSlug) ? storeSlug[0] : storeSlug,
  //           "x-product-id": Array.isArray(productId) ? productId[0] : productId,
  //         },
  //       });

  //       console.log(res);
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }

  //       const data = await res.json();
  //       console.log("Fetched product details: ", data);

  //       if (data[0]?.result?.data?.json) {
  //         setProductDetails(data[0].result.data.json);
  //       } else {
  //         throw new Error("Invalid data format");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching product details", err);
  //       setError(err instanceof Error ? err.message : "Unknown error occured");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProductDetails();
  // }, [productId, storeSlug]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!storeSlug || !productId) return;

      try {
        setLoading(true);
        const input = { id: productId };
        // 2. Serialize with SuperJSON
        const serialized = superjson.stringify(input);

        // 3. Make the request
        const url = `http://localhost:3000/api/trpc/public.product.getById?input=${encodeURIComponent(
          serialized
        )}`;

        const res = await fetch(url, {
          headers: {
            "x-store-slug": Array.isArray(storeSlug) ? storeSlug[0] : storeSlug,
            // "x-product-id": Array.isArray(productId) ? productId[0] : productId,
            "Content-Type": "application/json",
          },
        });

        // 4. Deserialize the response
        const rawData = await res.json();
        const data = superjson.parse(JSON.stringify(rawData));

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        // const data = await res.json();
        console.log("Full response:", rawData);

        if (rawData?.result?.data?.json) {
          setProductDetails(rawData.result.data.json);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching product details", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, storeSlug]);

  const handleQuantityChange = (change: number): void => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (productDetails?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (): void => {
    // Add to cart logic here
    console.log(`Added ${quantity} ${productDetails?.name} to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-gray-600 text-lg">No product found</p>
        </motion.div>
      </div>
    );
  }

  // Mock additional images for demonstration
  const productImages: string[] = [
    productDetails.image,
    productDetails.image,
    productDetails.image,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Products
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col-reverse"
          >
            {/* Thumbnail Images */}
            <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
                      selectedImage === index ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <span className="sr-only">Image {index + 1}</span>
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <div className="w-full aspect-w-1 aspect-h-1">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={productImages[selectedImage]}
                alt={productDetails.name}
                className="w-full h-96 lg:h-[600px] object-center object-cover sm:rounded-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0"
          >
            {/* Category */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                {productDetails.category}
              </span>
            </motion.div>

            {/* Product Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4"
            >
              {productDetails.name}
            </motion.h1>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center mb-6"
            >
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="ml-3 text-sm text-gray-600">(4.8 out of 5 stars)</p>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <p className="text-3xl font-bold text-gray-900">
                ${productDetails.price}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Free shipping on orders over $50
              </p>
            </motion.div>

            {/* Stock Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              {productDetails.inStock ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">
                    In stock ({productDetails.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium">Out of stock</span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {productDetails.description}
              </p>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="mx-4 text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= productDetails.stock}
                  className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!productDetails.inStock}
                className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-6 py-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                  isFavorite
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </motion.button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Product ID:</span>
                  <span className="font-medium">{productDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Added:</span>
                  <span className="font-medium">
                    {new Date(productDetails.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
