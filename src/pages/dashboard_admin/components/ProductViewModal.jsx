import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export function ProductViewModal({ open, onClose, product, merchantName }) {
  if (!product) return null;
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Detail Produk</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-2">
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="small">Deskripsi: {product.description}</Typography>
          <Typography variant="small">Harga: Rp{product.price}</Typography>
          <Typography variant="small">Status: {product.status}</Typography>
          <Typography variant="small">Merchant: {merchantName}</Typography>
          {product.image && (
            <img src={`http://localhost:3000/uploads/${product.image}`} alt="Product" className="w-32 h-32 object-cover rounded border mt-2" />
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ProductViewModal;
