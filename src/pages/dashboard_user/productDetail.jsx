import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "@/api/product";
import { getToken } from "@/utils/auth";
import { Card, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { createOrder } from "@/api/order";
import { useAuthContext } from "@/context/AuthContext";

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [address, setAddress] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Koordinat base puspa
  const puspaCoords = {
    1: { lat: -6.980293143250459, lng: 108.47972538579133 }, // siliwangi
    2: { lat: -6.981790448240751, lng: 108.47824661215267 }, // langlangbuana
    3: { lat: -6.983902676970152, lng: 108.4759132556421 }, // tamankota
  };

  // Hitung jarak haversine
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Ambil lokasi user
  useEffect(() => {
    if (!product) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationAllowed(true);
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setLocationAllowed(false)
    );
  }, [product]);

  // Hitung delivery fee
  useEffect(() => {
    if (!userCoords || !product?.merchant?.place_id) return;
    const base = 5000;
    const perKm = 5000;
    const puspa = puspaCoords[product.merchant.place_id];
    if (!puspa) return;
    const dist = getDistanceFromLatLonInKm(userCoords.lat, userCoords.lng, puspa.lat, puspa.lng);
    setDeliveryFee(base + Math.ceil(dist) * perKm);
  }, [userCoords, product]);

  async function handleCheckout() {
    if (!locationAllowed || !userCoords) {
      alert("Aktifkan lokasi untuk melakukan order!");
      return;
    }
    if (!address) {
      alert("Alamat pengiriman harus diisi!");
      return;
    }
    setCheckoutLoading(true);
    try {
      const customer_id = user?.id; // ambil dari context user login
      if (!customer_id) throw new Error("User tidak ditemukan");
      const orderData = {
        customer_id,
        merchant_id: product.merchant_id,
        total_price: Number(product.price),
        delivery_address: address,
        delivery_fee: deliveryFee,
        status: "pending",
      };
      await createOrder(orderData);
      alert("Checkout berhasil!");
      navigate("/dashboard/pesanan-saya");
    } catch (e) {
      alert("Checkout gagal! " + (e.message || ""));
    } finally {
      setCheckoutLoading(false);
    }
  }

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

  // Format rupiah
  function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  }

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
          src={product.image ? `http://localhost:3000/uploads/${product.image}` : "/img/default.jpg"}
          alt={product.name}
          className="w-full md:w-80 h-64 object-cover rounded-xl border"
        />
        <div className="flex-1">
          <Typography variant="h4" className="font-bold mb-2">{product.name}</Typography>
          <Typography variant="paragraph" className="mb-2">{product.description}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Harga: Rp{product.price}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Status: {product.status}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Merchant: {product.merchant?.name}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">Owner: {product.merchant?.owner_name}</Typography>
          <Typography variant="small" className="mb-1 text-blue-gray-600">No. HP: {product.merchant?.phone}</Typography>
          <Button className="mt-4" color="green" onClick={() => setShowOrderForm(true)}>
            Order Now
          </Button>
        </div>
      </Card>
      {/* Modal Order */}
      <Dialog open={showOrderForm} handler={() => setShowOrderForm(false)} size="md">
        <DialogHeader>Order Produk</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="small">Harga: {formatRupiah(product.price)}</Typography>
            <Typography variant="small">Merchant: {product.merchant?.name}</Typography>
            <label className="block mb-1 font-medium mt-2">Alamat Pengiriman</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Masukkan alamat pengiriman"
              disabled={!locationAllowed}
            />
            <div>
              <Typography variant="small" className="text-blue-gray-600">
                Delivery Fee: {formatRupiah(deliveryFee)} <br/>
                <span className="text-xs text-gray-500">(Biaya pengiriman: 5rb + 5rb/km dari lokasi Anda ke puspa. Dalam lingkup 5rb jika &lt; 1km)</span>
              </Typography>
              {!locationAllowed && (
                <Typography variant="small" className="text-red-500">
                  Aktifkan lokasi untuk melakukan order
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            color="green"
            onClick={handleCheckout}
            disabled={!locationAllowed || checkoutLoading}
            loading={checkoutLoading}
          >
            Checkout
          </Button>
          <Button
            color="red"
            variant="text"
            onClick={() => setShowOrderForm(false)}
            className="ml-2"
          >
            Batal
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ProductDetail;
