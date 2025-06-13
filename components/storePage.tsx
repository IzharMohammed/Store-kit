import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Head from "next/head";

interface Product {
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

interface StoreData {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const StorePage = ({ data }: { data: StoreData }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Extract all unique categories from dynamic data
  const categories = ["All", ...new Set(data.products.map(p => p.category))];

  // Filter products based on category and search query
  const filteredProducts = data.products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.03 }
  };

  const priceVariants = {
    rest: { y: 0 },
    hover: { y: -5 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Product Store</title>
        <meta name="description" content="Browse our amazing products" />
      </Head>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm py-6"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          
          <motion.div 
            className="mt-6 flex flex-col md:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.div 
                className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none"
                animate={{
                  borderColor: searchQuery ? "rgba(59, 130, 246, 0.5)" : "transparent"
                }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <select
              className="px-4 py-2 border border-grayhttps://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&auto=format&fit=crop-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {filteredProducts.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <h2 className="text-xl font-medium text-gray-500">No products found</h2>
              <p className="mt-2 text-gray-400">Try adjusting your search or filter</p>
            </motion.div>
          ) : (
            <motion.div
              key="product-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                  onHoverStart={() => setHoveredProduct(product.id)}
                  onHoverEnd={() => setHoveredProduct(null)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <motion.div
                    variants={hoverVariants}
                    className="relative aspect-square bg-gray-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
                        >
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="bg-white px-4 py-2 rounded-full font-medium shadow-md"
                          >
                            View Details
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <motion.span
                        variants={priceVariants}
                        className="font-bold text-blue-600"
                      >
                        ${product.price.toFixed(2)}
                      </motion.span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md"
                        disabled={!product.inStock}
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {data.pagination.totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center gap-2"
          >
            <button
              disabled={!data.pagination.hasPrev}
              className={`px-4 py-2 rounded-md ${data.pagination.hasPrev ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <button
              disabled={!data.pagination.hasNext}
              className={`px-4 py-2 rounded-md ${data.pagination.hasNext ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              Next
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default StorePage;