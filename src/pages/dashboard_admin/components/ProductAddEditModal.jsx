import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input } from "@material-tailwind/react";

export function ProductAddEditModal({ open, onClose, form, onChange, onSave, saving, error, onImageChange, imageFile, merchants, isEdit }) {
  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>{isEdit ? "Edit Produk" : "Tambah Produk"}</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col gap-4">
          <Input label="Nama Produk" name="name" value={form.name} onChange={onChange} required />
          <Input label="Deskripsi" name="description" value={form.description} onChange={onChange} required />
          <Input label="Harga" name="price" value={form.price} onChange={onChange} type="number" required />
          <div>
            <label className="block text-xs mb-1">Merchant</label>
            <select name="merchant_id" value={form.merchant_id} onChange={onChange} className="w-full px-3 py-2 border rounded">
              <option value="">Pilih Merchant</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Status</label>
            <select name="status" value={form.status} onChange={onChange} className="w-full px-3 py-2 border rounded">
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <Input type="file" label="Upload Gambar" accept="image/*" onChange={onImageChange} />
          {/* Preview gambar lama jika ada dan belum pilih gambar baru */}
          {form.image && !imageFile && isEdit && (
            <img src={`http://localhost:3000/uploads/${form.image}`} alt="Preview" className="w-32 h-32 object-cover rounded border mt-2" />
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

export default ProductAddEditModal;
