import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input } from "@material-tailwind/react";

export function UserViewModal({ open, onClose, user }) {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader>Detail User</DialogHeader>
      <DialogBody divider>
        {user ? (
          <div className="flex flex-col gap-2">
            <div><b>ID:</b> {user.id}</div>
            <div><b>Nama:</b> {user.name || user.fullname}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Role:</b> {user.role}</div>
            {/* Tambahkan field lain sesuai kebutuhan */}
          </div>
        ) : <Typography color="red">User tidak ditemukan</Typography>}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose}>Tutup</Button>
      </DialogFooter>
    </Dialog>
  );
}

export function UserEditModal({ open, onClose, user, onChange, onSave, saving, error }) {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogHeader>Edit User</DialogHeader>
      <DialogBody divider>
        {user && (
          <div className="flex flex-col gap-4">
            <Input name="name" label="Nama" value={user.name || user.fullname || ""} onChange={onChange} required />
            <Input name="email" label="Email" value={user.email || ""} onChange={onChange} required />
            <Input name="role" label="Role" value={user.role || ""} onChange={onChange} required />
            {/* Tambahkan field lain sesuai kebutuhan */}
            {error && <Typography color="red" className="text-xs">{error}</Typography>}
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose} disabled={saving}>Batal</Button>
        <Button color="green" onClick={onSave} loading={saving} className="ml-2">Simpan</Button>
      </DialogFooter>
    </Dialog>
  );
}

export function UserDeleteModal({ open, onClose, onDelete, deleting }) {
  return (
    <Dialog open={open} handler={onClose} size="xs">
      <DialogHeader>Hapus User</DialogHeader>
      <DialogBody divider>
        Apakah Anda yakin ingin menghapus user ini?
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="gray" onClick={onClose} disabled={deleting}>Batal</Button>
        <Button color="red" onClick={onDelete} loading={deleting} className="ml-2">Hapus</Button>
      </DialogFooter>
    </Dialog>
  );
}
