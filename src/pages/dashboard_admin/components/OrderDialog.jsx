import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Select, Option } from "@material-tailwind/react";

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(num));
}

const statusOptions = [
  "pending",
  "confirmed",
  "on_delivery",
  "delivered",
  "cancelled"
];

export default function AdminOrderDialog({ open, onClose, order, onSaveStatus }) {
  const [status, setStatus] = React.useState(order?.status || "pending");
  React.useEffect(() => {
    setStatus(order?.status || "pending");
  }, [order]);

  if (!order) return null;
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Detail & Edit Pesanan</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-2">
          <Typography variant="h6">Pesanan #{order.id}</Typography>
          <Typography variant="small">Nama Pemesan: {order.customer?.fullname || '-'}</Typography>
          <Typography variant="small">Merchant: {order.merchant?.name || '-'}</Typography>
          <Typography variant="small">Alamat Pengiriman: {order.delivery_address}</Typography>
          <Typography variant="small">Harga: {formatRupiah(order.total_price)}</Typography>
          <Typography variant="small">Delivery Fee: {formatRupiah(order.delivery_fee)}</Typography>
          <Typography variant="small">Tanggal: {order.created_at ? new Date(order.created_at).toLocaleString('id-ID') : '-'}</Typography>
          <div className="mt-2">
            <label className="block text-xs mb-1">Status</label>
            <Select value={status} onChange={setStatus} label="Status">
              {statusOptions.map(opt => (
                <Option key={opt} value={opt}>{opt}</Option>
              ))}
            </Select>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="green" onClick={() => onSaveStatus(status)}>
          Simpan Status
        </Button>
        <Button color="gray" variant="text" onClick={onClose} className="ml-2">
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
