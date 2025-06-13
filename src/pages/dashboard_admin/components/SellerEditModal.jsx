import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input } from "@material-tailwind/react";

export function SellerEditModal({ open, onClose, seller, onChange, onSave, saving, error, onImageChange, imageFile }) {
  if (!seller) return null;
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Edit Seller</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-4">
          <Input label="Nama Merchant" name="name" value={seller.name} onChange={onChange} required />
          <Input label="Nama Pemilik" name="owner_name" value={seller.owner_name} onChange={onChange} required />
          <Input label="No. Telp" name="phone" value={seller.phone} onChange={onChange} required />
          <Input label="Deskripsi" name="description" value={seller.description} onChange={onChange} required />
          <div className="flex gap-2">
            <Input label="Jam Buka" name="open_time" value={seller.open_time} onChange={onChange} type="time" required />
            <Input label="Jam Tutup" name="close_time" value={seller.close_time} onChange={onChange} type="time" required />
          </div>
          <div>
            <label className="block text-xs mb-1">Status</label>
            <select name="status" value={seller.status} onChange={onChange} className="w-full px-3 py-2 border rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <Input type="file" label="Upload Gambar" accept="image/*" onChange={onImageChange} />
          {/* Preview gambar lama jika ada dan belum pilih gambar baru */}
          {seller.image && !imageFile && (
            <img src={`http://localhost:3000/uploads/${seller.image}`} alt="Preview" className="w-32 h-32 object-cover rounded border mt-2" />
          )}
          {/* Preview gambar baru jika dipilih */}
          {imageFile && (
            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-32 h-32 object-cover rounded border mt-2" />
          )}
          {error && <Typography color="red" className="text-xs">{error}</Typography>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose} disabled={saving}>Batal</Button>
        <Button color="green" onClick={onSave} loading={saving} className="ml-2">Simpan</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default SellerEditModal;
