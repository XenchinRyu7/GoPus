import React, { useState } from 'react';
import { PuspaCard } from "@/components/PuspaCard";
import { faker } from '@faker-js/faker';

const PRODUCTS_PER_PAGE = 12;

export function Product ()  {
  const [currentPage, setCurrentPage] = useState(1);

  const generateProducts = (count) => {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        image: faker.image.urlLoremFlickr({ width: 320, height: 240, category: 'food' }),
        seller: faker.company.name(),
        location: faker.location.city(),
        category: faker.commerce.department(),
        rating: (4 + Math.random()).toFixed(1)
      });
    }
    return products;
  };

  const allProducts = generateProducts(50);

  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, endIndex);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-6">
        {currentProducts.map((product) => (
          <PuspaCard
            key={product.id}
            name={product.name}
            image={product.image}
            title={product.name}
            description={product.description}
            rating={product.rating}
            seller={product.seller}
            location={product.location}
            category={product.category}
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
    </div>
  );
};

export default Product;