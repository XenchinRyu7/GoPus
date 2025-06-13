import React, { useState, useEffect } from 'react';
import { PuspaCard } from "@/components/PuspaCard";
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '@/api/product';
import { getToken } from '@/utils/auth';

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

  function getSafeImage(img) {
    if (!img) return undefined;
    if (img.includes("drive.google.com/open?id=")) {
      const id = img.split("id=")[1];
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    if (img.includes("drive.google.com/file/d/")) {
      const match = img.match(/\/d\/([\w-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    // Jika image bukan link valid, fallback ke default
    if (img.startsWith("/img/")) {
      return img;
    }
    return undefined;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-10 text-blue-gray-500">Loading products...</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
            {currentProducts.map((product) => (
              <PuspaCard
                key={product.id}
                name={product.name}
                image={getSafeImage(product.image) || getSafeImage(product.merchant?.image) || `/img/default.jpg`}
                title={product.name}
                description={product.description}
                rating={product.rating}
                seller={product.merchant?.name || product.seller}
                location={product.location}
                category={product.category}
                onClick={() => navigate(`/dashboard/product/${product.id}`)}
              />
            ))}
          </div>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex mx-4">
              {renderPaginationNumbers()}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;