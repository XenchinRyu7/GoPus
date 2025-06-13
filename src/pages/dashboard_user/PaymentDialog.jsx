import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(num));
}

// Dummy QRIS dan nomor admin per puspa
const puspaQris = {
  1: {
    qris: "/img/qris_siliwangi.png",
    wa: "6281234567890"
  },
  2: {
    qris: "/img/qris_langlangbuana.png",
    wa: "6289876543210"
  },
  3: {
    qris: "/img/qris_tamankota.png",
    wa: "6281122334455"
  }
};

export default function PaymentDialog({ open, onClose, order }) {
  if (!order) return null;
  const puspaId = order.merchant?.place_id || 1;
  const qrisData = puspaQris[puspaId];
  const waNumber = qrisData?.wa || "6281234567890";
  const waMsg = encodeURIComponent(`Halo admin, saya sudah bayar order #${order.id} atas nama ${order.customer?.fullname || '-'} di merchant ${order.merchant?.name || '-'} dengan total ${formatRupiah(order.total_price)}.`);
  const waLink = `https://wa.me/${waNumber}?text=${waMsg}`;

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Pembayaran QRIS</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-3 items-center">
          <Typography variant="h6">Order #{order.id}</Typography>
          <Typography variant="small">Merchant: {order.merchant?.name || '-'}</Typography>
          <Typography variant="small">Total: {formatRupiah(order.total_price)}</Typography>
          <Typography variant="small">Delivery Fee: {formatRupiah(order.delivery_fee)}</Typography>
          <Typography variant="small">Status: {order.status}</Typography>
          <div className="mt-2 mb-2">
            <Typography variant="small">Scan QRIS berikut untuk membayar:</Typography>
            <img src={qrisData?.qris} alt="QRIS" className="w-40 h-40 object-contain border rounded mt-2" />
          </div>
          <Typography variant="small" className="text-gray-500 text-center">Setelah membayar, klik tombol di bawah untuk konfirmasi ke admin via WhatsApp.</Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="green" as="a" href={waLink} target="_blank" rel="noopener noreferrer">
          Saya sudah bayar (Konfirmasi ke Admin)
        </Button>
        <Button color="red" variant="text" onClick={onClose} className="ml-2">
          Batal
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
