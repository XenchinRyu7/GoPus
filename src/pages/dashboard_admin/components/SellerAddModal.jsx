import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input } from "@material-tailwind/react";

export function SellerAddModal({ open, onClose, form, onChange, onSave, saving, error, onImageChange, imageFile, placeLabel }) {
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Tambah Seller</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-4">
          <Input label="Nama Merchant" name="name" value={form.name} onChange={onChange} required />
          <Input label="Nama Pemilik" name="owner_name" value={form.owner_name} onChange={onChange} required />
          <Input label="No. Telp" name="phone" value={form.phone} onChange={onChange} required />
          <Input label="Deskripsi" name="description" value={form.description} onChange={onChange} required />
          <div className="flex gap-2">
            <Input label="Jam Buka" name="open_time" value={form.open_time} onChange={onChange} type="time" required />
            <Input label="Jam Tutup" name="close_time" value={form.close_time} onChange={onChange} type="time" required />
          </div>
          <div>
            <label className="block text-xs mb-1">Tempat</label>
            <Input value={placeLabel} disabled readOnly className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs mb-1">Status</label>
            <select name="status" value={form.status} onChange={onChange} className="w-full px-3 py-2 border rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <Input type="file" label="Upload Gambar" accept="image/*" onChange={onImageChange} />
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

export default SellerAddModal;
