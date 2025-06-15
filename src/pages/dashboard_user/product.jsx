import React, { useState, useEffect } from 'react';
import { PuspaCard } from "@/components/PuspaCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '@/api/product';
import { getToken } from '@/utils/auth';
import { Card } from '@material-tailwind/react';

const PRODUCTS_PER_PAGE = 12;

const placeIdByPath = {
  '/puspa-taman-kota': 3,
  '/siliwangi': 1,
  '/langlangbuana': 2,
};

export function Product ()  {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1); // Reset ke halaman 1 setiap ganti route
    async function fetchProducts() {
      setLoading(true);
      try {
        const token = getToken();
        const res = await getProducts(token);
        let all = res.data || res;
        // Normalisasi path agar selalu tanpa /dashboard di depan
        let path = location.pathname.replace(/^\/dashboard/, "");
        if (!path.startsWith("/")) path = "/" + path;
        const placeId = placeIdByPath[path];
        if (placeId) {
          all = all.filter((p) => p.merchant && p.merchant.place_id === placeId);
        }
        setProducts(all);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [location.pathname]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-1 px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="w-full py-8">
    <Card className="p-4 bg-white border border-blue-gray-100 shadow-none mb-6">

      {loading ? (
        <div className="text-center py-10 text-blue-gray-500">Loading products...</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
            {currentProducts.map((product) => (
              <PuspaCard
                key={product.id}
                name={product.name}
                image={product.image ? `http://localhost:3000/uploads/${product.image}` : "/img/default.jpg"}
                title={product.name}
                description={product.description}
                rating={product.rating}
                seller={product.merchant?.name}
                location={(() => {
                  const place = Object.entries(placeIdByPath).find(([, id]) => id === product.merchant?.place_id);
                  if (place) {
                    if (place[1] === 3) return "Puspa Taman Kota";
                    if (place[1] === 1) return "Puspa Siliwangi";
                    if (place[1] === 2) return "Puspa Langlangbuana";
                  }
                  return product.location;
                })()}
                category={product.category}
                onClick={() => navigate(`/dashboard/product/${product.id}`)}
              />
            ))}
          </div>
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded text-lg text-blue-gray-400 hover:text-blue-600 disabled:opacity-50"
            >
              &#171;
            </button>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded text-lg text-blue-gray-400 hover:text-blue-600 disabled:opacity-50"
            >
              &#8249;
            </button>
            <span className="px-4 py-2 rounded-lg bg-green-50 text-green-700 font-bold border border-green-200">
              {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded text-lg text-blue-gray-400 hover:text-blue-600 disabled:opacity-50"
            >
              &#8250;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded text-lg text-blue-gray-400 hover:text-blue-600 disabled:opacity-50"
            >
              &#187;
            </button>
          </div>
        </>
      )}
    </Card>
    </div>
  );
};

export default Product;