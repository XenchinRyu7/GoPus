import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(num));
}

export function OrderViewModal({ open, onClose, order }) {
  if (!order) return null;
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Detail Pesanan</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-2">
          <Typography variant="h6">Pesanan #{order.id}</Typography>
          <Typography variant="small">Nama Pemesan: {order.customer?.fullname || '-'}</Typography>
          <Typography variant="small">Merchant: {order.merchant?.name || '-'}</Typography>
          <Typography variant="small">Alamat Pengiriman: {order.delivery_address}</Typography>
          <Typography variant="small">Harga: {formatRupiah(order.total_price)}</Typography>
          <Typography variant="small">Delivery Fee: {formatRupiah(order.delivery_fee)}</Typography>
          <Typography variant="small">Status: {order.status}</Typography>
          <Typography variant="small">Tanggal: {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}</Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default OrderViewModal;
