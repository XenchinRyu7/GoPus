import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export default function DeleteOrderDialog({ open, onClose, onDelete, order }) {
  if (!order) return null;
  return (
    <Dialog open={open} handler={onClose} size="xs">
      <DialogHeader>Hapus Pesanan</DialogHeader>
      <DialogBody divider>
        <Typography variant="small">
          Apakah Anda yakin ingin menghapus pesanan #{order.id} atas nama <b>{order.customer?.fullname || '-'}</b>?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={onDelete}>
          Hapus
        </Button>
        <Button color="gray" variant="text" onClick={onClose} className="ml-2">
          Batal
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
