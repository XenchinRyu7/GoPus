import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "@/api/product";
import { getToken } from "@/utils/auth";
import { Card, Typography, Button } from "@material-tailwind/react";
import { PuspaCard } from "@/components/PuspaCard";

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
  if (img.startsWith("/img/")) {
    return img;
  }
  return undefined;
}

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const token = getToken();
        const res = await getProducts(token);
        const all = res.data || res;
        const found = all.find((p) => String(p.id) === String(id));
        setProduct(found);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-blue-gray-500">Loading product...</div>;
  }
  if (!product) {
    return <div className="text-center py-10 text-red-500">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate(-1)} className="mb-4">Kembali</Button>
      <Card className="p-6 flex flex-col md:flex-row gap-8 items-start">
        <img
          src={getSafeImage(product.image) || getSafeImage(product.merchant?.image) || "/img/default.jpg"}
          alt={product.name}
          className="w-full md:w-80 h-64 object-cover rounded-xl border"
        />
        <div className="flex-1">
          <Typography variant="h4" className="font-bold mb-2">{product.name}</Typography>
          <Typography variant="paragraph" className="mb-2">{product.description}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Kategori: {product.category}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Lokasi: {product.location}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Penjual: {product.merchant?.name || product.seller}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Rating: {product.rating}</Typography>
        </div>
      </Card>
    </div>
  );
}

export default ProductDetail;
