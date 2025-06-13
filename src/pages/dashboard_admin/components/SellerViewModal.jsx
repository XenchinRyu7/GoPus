import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export function SellerViewModal({ open, onClose, seller }) {
  if (!seller) return null;
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Detail Seller</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-2">
          <Typography variant="h6">{seller.name}</Typography>
          <Typography variant="small">Pemilik: {seller.owner_name}</Typography>
          <Typography variant="small">No. Telp: {seller.phone}</Typography>
          <Typography variant="small">Deskripsi: {seller.description}</Typography>
          <Typography variant="small">Jam Buka: {seller.open_time}</Typography>
          <Typography variant="small">Jam Tutup: {seller.close_time}</Typography>
          <Typography variant="small">Status: {seller.status}</Typography>
          <Typography variant="small">Tempat: {(() => {
            if (seller.place_id === 1) return "Puspa Siliwangi";
            if (seller.place_id === 2) return "Puspa Langlangbuana";
            if (seller.place_id === 3) return "Puspa Taman Kota";
            return seller.place_id;
          })()}</Typography>
          {seller.image && (
            <img src={`http://localhost:3000/uploads/${seller.image}`} alt="Seller" className="w-32 h-32 object-cover rounded border mt-2" />
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default SellerViewModal;
