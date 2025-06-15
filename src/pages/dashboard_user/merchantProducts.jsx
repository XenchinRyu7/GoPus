import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByMerchant } from "@/api/product";
import { getToken } from "@/utils/auth";
import { Card, Typography, Button, Tabs, TabsBody, TabPanel, Avatar } from "@material-tailwind/react";

export function MerchantProducts() {
  const { merchant_id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const token = getToken();
        const res = await getProductsByMerchant(token, merchant_id);
        setProducts(res.data || res);
        if ((res.data || res).length > 0) setMerchant((res.data || res)[0].merchant);
      } catch {
        setProducts([]);
        setMerchant(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [merchant_id]);

  if (loading) return <div className="text-center py-10 text-blue-gray-500">Loading...</div>;
  if (!products.length) return <div className="text-center py-10 text-red-500">Produk tidak ditemukan.</div>;

  return (
    <div className="w-full py-8">
    <Button onClick={() => navigate(-1)} className="mb-4">Kembali</Button>
      <Card className="p-4 flex flex-col md:flex-row items-center gap-4 mb-6 border border-blue-gray-100">
        <Avatar src={merchant?.image ? `http://localhost:3000/uploads/${merchant.image}` : "/img/placeholder.png"} alt={merchant?.name} size="xl" className="border" />
        <div className="flex-1">
          <Typography variant="h5" className="font-bold mb-1">{merchant?.name}</Typography>
          {merchant?.description && (
            <Typography variant="small" className="text-blue-gray-600 mb-1">{merchant.description}</Typography>
          )}
          {merchant?.owner_name && (
            <Typography variant="small" className="text-blue-gray-600 mb-1">Owner: {merchant.owner_name}</Typography>
          )}
          {merchant?.place_id && (
            <Typography variant="small" className="text-blue-gray-600 mb-1">Puspa: {merchant.place_id === 1 ? 'Siliwangi' : merchant.place_id === 2 ? 'Langlangbuana' : merchant.place_id === 3 ? 'Taman Kota' : merchant.place_id}</Typography>
          )}
          {merchant?.phone && (
            <Typography variant="small" className="text-blue-gray-600 mb-1">No. HP: {merchant.phone}</Typography>
          )}
        </div>
      </Card>
      <Tabs value="produk" className="mb-6">
        <TabsBody>
          <TabPanel value="produk" className="p-0">
            <Typography variant="h6" className="mb-4 font-bold">Semua Produk</Typography>
            <Card className="p-4 bg-white border border-blue-gray-100 shadow-none mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product.id} className="w-full h-full flex">
                    <Card className="p-3 flex flex-col items-center border border-blue-gray-100 relative group hover:shadow-lg transition w-full">
                      <img
                        src={product.image ? `http://localhost:3000/uploads/${product.image}` : "/img/default.jpg"}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-2 border"
                      />
                      <Typography variant="h6" className="font-bold mb-1 text-center line-clamp-2 min-h-[32px]">{product.name}</Typography>
                      {product.description && (
                        <Typography variant="small" className="mb-1 text-blue-gray-600 text-center line-clamp-2 min-h-[32px]">{product.description}</Typography>
                      )}
                      <div className="flex flex-col items-center mb-1">
                        <span className="text-green-600 font-bold text-lg">Rp{product.price}</span>
                      </div>
                      <Button color="green" size="sm" className="mt-2 w-full" onClick={() => window.location.href = `/dashboard/product/${product.id}`}>Lihat Detail</Button>
                    </Card>
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
}

export default MerchantProducts;
