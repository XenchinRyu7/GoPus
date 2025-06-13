"use client";

import * as React from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  Button,
  Card,
  CardBody,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  EditPencil,
  EyeSolid,
  MoreHorizCircle,
  NavArrowDown,
  NavArrowUp,
  Search,
  Bin,
} from "iconoir-react";
import { faker } from "@faker-js/faker";
import { twMerge } from "tailwind-merge";
import { rankItem } from "@tanstack/match-sorter-utils";
import { getSellers, addSeller, deleteSeller } from "@/api/seller";
import { getToken, getUserData } from "@/utils/auth";
import SellerViewModal from "./components/SellerViewModal";
import SellerEditModal from "./components/SellerEditModal";
import SellerAddModal from "./components/SellerAddModal";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

function range(len) {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
}

function newOrder() {
  return {
    name: faker.person.fullName(),
    food: faker.commerce.productName(),
    price: faker.number.int({ min: 10000, max: 200000 }),
    date: faker.date.recent({ days: 30 }).toLocaleDateString("id-ID"),
    status: faker.helpers.arrayElement(["Paid", "Refunded", "Failed"]),
  };
}

function makeData(len) {
  return range(len).map(() => newOrder());
}

const placeIdByAdmin = {
  "admin@siliwangi.com": 1,
  "admin@langlangbuana.com": 2,
  "admin@tamankota.com": 3,
};

const TableSellers = () => {
  const columns = React.useMemo(
    () => [
      {
        header: "Nama Merchant",
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: "Nama Pemilik",
        accessorKey: "owner_name",
        cell: (info) => info.getValue(),
      },
      {
        header: "No. Telp",
        accessorKey: "phone",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Deskripsi",
        accessorKey: "description",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => info.getValue(),
      },
      {
        header: "Jam Buka",
        accessorKey: "open_time",
        cell: (info) => info.getValue(),
      },
      {
        header: "Jam Tutup",
        accessorKey: "close_time",
        cell: (info) => info.getValue(),
      },
      {
        header: "Place",
        accessorKey: "place_id",
        cell: (info) => {
          const val = info.getValue();
          if (val === 1) return "Puspa Siliwangi";
          if (val === 2) return "Puspa Langlangbuana";
          if (val === 3) return "Puspa Taman Kota";
          return val;
        },
      },
      {
        header: "Aksi",
        accessorKey: "action",
        cell: (info) => (
          <div className="w-full text-end">
            <Menu placement="bottom-end">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <MoreHorizCircle className="h-5 w-5" />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem className="flex items-center gap-2" onClick={() => handleView(info.row.original)}>
                  <EyeSolid className="h-4 w-4 stroke-2" /> View
                </MenuItem>
                <MenuItem className="flex items-center gap-2" onClick={() => handleEdit(info.row.original)}>
                  <EditPencil className="h-4 w-4 stroke-2" /> Edit
                </MenuItem>
                <MenuItem className="flex items-center gap-2 text-red-500" onClick={() => handleDelete(info.row.original)}>
                  <Bin className="h-4 w-4 stroke-2" /> Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        ),
      },
    ],
    []
  );

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    owner_name: "",
    phone: "",
    address: "",
    status: "Active",
    open_time: "08:00",
    close_time: "17:00",
    place_id: 1,
  });
  const [imageFile, setImageFile] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedSeller, setSelectedSeller] = React.useState(null);
  const [editForm, setEditForm] = React.useState(null);
  const [editImageFile, setEditImageFile] = React.useState(null);
  const [editSaving, setEditSaving] = React.useState(false);
  const [editError, setEditError] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState({
    name: "",
    owner_name: "",
    phone: "",
    description: "",
    status: "Active",
    open_time: "08:00",
    close_time: "17:00",
    place_id: 1,
  });
  const [addImageFile, setAddImageFile] = React.useState(null);
  const [addSaving, setAddSaving] = React.useState(false);
  const [addError, setAddError] = React.useState("");
  const user = getUserData();
  const adminEmail = user?.email;
  const placeId = placeIdByAdmin[adminEmail] || 1;
  const placeLabel = placeId === 1 ? "Puspa Siliwangi" : placeId === 2 ? "Puspa Langlangbuana" : "Puspa Taman Kota";

  React.useEffect(() => {
    async function fetchSellers() {
      setLoading(true);
      try {
        const token = getToken();
        const user = getUserData();
        if (!token || !user) return;
        const res = await getSellers(token);
        let sellers = res.data || res;
        const adminEmail = user.email;
        const placeId = placeIdByAdmin[adminEmail];
        if (placeId) {
          sellers = sellers.filter((s) => s.place_id === placeId);
        }
        setData(sellers);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSellers();
  }, []);

  React.useEffect(() => {
    // Set place_id otomatis sesuai admin saat modal dibuka
    if (open) {
      const user = getUserData();
      const adminEmail = user?.email;
      const placeId = placeIdByAdmin[adminEmail] || 1;
      setForm((prev) => ({ ...prev, place_id: placeId }));
    }
  }, [open]);

  React.useEffect(() => {
    if (addOpen) {
      setAddForm((prev) => ({ ...prev, place_id: placeId }));
    }
  }, [addOpen, placeId]);

  const handleOpen = () => setOpen(!open);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("owner_name", form.owner_name);
      formData.append("phone", form.phone);
      formData.append("description", form.description);
      formData.append("open_time", form.open_time);
      formData.append("close_time", form.close_time);
      formData.append("status", form.status);
      formData.append("place_id", form.place_id);
      if (imageFile) {
        formData.append("image", imageFile); // field 'image' sesuai Multer backend
      }
      await addSeller(token, formData, true); // true = formData
      setOpen(false);
      setForm({
        name: "",
        owner_name: "",
        phone: "",
        description: "",
        status: "Active",
        open_time: "08:00",
        close_time: "17:00",
        place_id: form.place_id,
      });
      setImageFile(null);
      // Refresh sellers
      const res = await getSellers(token);
      let sellers = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) sellers = sellers.filter((s) => s.place_id === placeId);
      setData(sellers);
    } catch (e) {
      setError("Gagal menambah seller");
    } finally {
      setSaving(false);
    }
  };

  const handleView = (seller) => {
    setSelectedSeller(seller);
    setViewOpen(true);
  };
  const handleEdit = (seller) => {
    setEditForm({ ...seller });
    setEditImageFile(null);
    setEditError("");
    setEditOpen(true);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImageFile(file);
  };
  const handleEditSave = async () => {
    setEditSaving(true);
    setEditError("");
    try {
      const token = getToken();
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
      if (editImageFile) formData.append("image", editImageFile);
      // PATCH/PUT endpoint assumed: /merchant/:id
      await fetch(`http://localhost:3000/api/v1/merchant/${editForm.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setEditOpen(false);
      setEditForm(null);
      setEditImageFile(null);
      // Refresh sellers
      const res = await getSellers(token);
      let sellers = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) sellers = sellers.filter((s) => s.place_id === placeId);
      setData(sellers);
    } catch (e) {
      setEditError("Gagal update seller");
    } finally {
      setEditSaving(false);
    }
  };

  const handleAddOpen = () => setAddOpen(!addOpen);
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    setAddImageFile(file);
  };
  const handleAddSave = async () => {
    setAddSaving(true);
    setAddError("");
    try {
      const token = getToken();
      const formData = new FormData();
      Object.entries(addForm).forEach(([k, v]) => formData.append(k, v));
      if (addImageFile) formData.append("image", addImageFile);
      await addSeller(token, formData, true);
      setAddOpen(false);
      setAddForm({
        name: "",
        owner_name: "",
        phone: "",
        description: "",
        status: "Active",
        open_time: "08:00",
        close_time: "17:00",
        place_id: placeId,
      });
      setAddImageFile(null);
      // Refresh sellers
      const res = await getSellers(token);
      let sellers = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) sellers = sellers.filter((s) => s.place_id === placeId);
      setData(sellers);
    } catch (e) {
      setAddError("Gagal menambah seller");
    } finally {
      setAddSaving(false);
    }
  };

  const handleDelete = async (seller) => {
    if (!window.confirm(`Yakin hapus seller ${seller.name}?`)) return;
    try {
      const token = getToken();
      await deleteSeller(token, seller.id);
      // Refresh sellers
      const res = await getSellers(token);
      let sellers = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) sellers = sellers.filter((s) => s.place_id === placeId);
      setData(sellers);
    } catch (e) {
      alert("Gagal menghapus seller");
    }
  };

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const pageCount = Math.ceil(data.length / pagination.pageSize);
  const pageNumbers = Array.from({ length: Math.min(5, pageCount) }, (_, i) => i);

  if (loading) {
    return (
      <Card className="h-full w-full p-4 flex items-center justify-center">
        <Typography variant="h6">Loading sellers...</Typography>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full p-4">
      <CardBody className="overflow-auto px-0">
        <div className="mb-4 flex justify-between gap-4">
          <div className="w-60 relative">
            <Input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              placeholder="Search"
              className="pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-blue-gray-400" />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-72">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-3 py-2 border border-blue-gray-200 rounded-md focus:outline-none focus:border-blue-500"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize} entries
                  </option>
                ))}
              </select>
            </div>
            <Button color="green" onClick={handleAddOpen} className="ml-2">+ Add Seller</Button>
          </div>
        </div>
        {/* Modal Add Seller */}
        <Dialog open={open} handler={handleOpen} size="md">
          <DialogHeader>Tambah Seller</DialogHeader>
          <DialogBody divider>
            <div className="flex flex-col gap-4">
              <Input label="Nama Merchant" name="name" value={form.name} onChange={handleChange} required />
              <Input label="Nama Pemilik" name="owner_name" value={form.owner_name} onChange={handleChange} required />
              <Input label="No. Telp" name="phone" value={form.phone} onChange={handleChange} required />
              <Input label="Deskripsi" name="description" value={form.description} onChange={handleChange} required />
              <div className="flex gap-2">
                <Input label="Jam Buka" name="open_time" value={form.open_time} onChange={handleChange} type="time" required />
                <Input label="Jam Tutup" name="close_time" value={form.close_time} onChange={handleChange} type="time" required />
              </div>
              <div>
                <label className="block text-xs mb-1">Tempat</label>
                <Input
                  value={(() => {
                    if (form.place_id === 1) return "Puspa Siliwangi";
                    if (form.place_id === 2) return "Puspa Langlangbuana";
                    if (form.place_id === 3) return "Puspa Taman Kota";
                    return form.place_id;
                  })()}
                  disabled
                  readOnly
                  className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <Input type="file" label="Upload Gambar" accept="image/*" onChange={handleImageChange} />
              {imageFile && (
                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-32 h-32 object-cover rounded border mt-2" />
              )}
              {error && <Typography color="red" className="text-xs">{error}</Typography>}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="gray" onClick={handleOpen} disabled={saving}>
              Cancel
            </Button>
            <Button color="green" onClick={handleSave} loading={saving} className="ml-2">
              Save
            </Button>
          </DialogFooter>
        </Dialog>
        <SellerViewModal open={viewOpen} onClose={() => setViewOpen(false)} seller={selectedSeller} />
        <SellerEditModal open={editOpen} onClose={() => setEditOpen(false)} seller={editForm} onChange={handleEditChange} onSave={handleEditSave} saving={editSaving} error={editError} onImageChange={handleEditImageChange} imageFile={editImageFile} />
        <SellerAddModal open={addOpen} onClose={handleAddOpen} form={addForm} onChange={handleAddChange} onSave={handleAddSave} saving={addSaving} error={addError} onImageChange={handleAddImageChange} imageFile={addImageFile} placeLabel={placeLabel} />
        <div className="w-full overflow-hidden rounded-lg border border-blue-gray-100">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="border-b border-blue-gray-100 bg-blue-gray-50 text-sm font-medium text-blue-gray-500">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isPrice = header.column.id === "price";

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="px-4 py-3 text-left font-medium"
                      >
                        <div
                          className={twMerge(
                            "flex items-center gap-2",
                            isPrice && "cursor-pointer select-none"
                          )}
                          onClick={() => {
                            if (isPrice && header.column.getCanSort()) {
                              header.column.toggleSorting();
                            }
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <NavArrowUp className="h-4 w-4 stroke-2" />,
                            desc: <NavArrowDown className="h-4 w-4 stroke-2" />,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="group text-sm text-blue-gray-800">
              {table.getRowModel().rows.map((row, key) => (
                <tr key={key} className="border-b border-blue-gray-50 last:border-0">
                  {row.getVisibleCells().map((cell, idx) => (
                    <td key={idx} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
          <span className="flex items-center gap-1">
            <Typography variant="small" className="text-blue-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
            </Typography>
          </span>
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => table.setPageIndex(0)}
              disabled={table.getState().pagination.pageIndex === 0}
              size="sm"
            >
              <span className="text-lg">&#171;</span>
            </IconButton>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="sm"
            >
              <span className="text-lg">&#8249;</span>
            </IconButton>
            {pageNumbers.map((num) => (
              <Button
                key={num}
                className={
                  table.getState().pagination.pageIndex === num
                    ? "bg-[#00B07426] text-[#00B074] shadow-none border border-[#00B074]"
                    : "bg-white text-black border border-blue-gray-200 hover:bg-blue-gray-50 hover:border-[#00B074]"
                }
                variant="text"
                color={undefined}
                onClick={() => table.setPageIndex(num)}
                size="sm"
                style={
                  table.getState().pagination.pageIndex === num
                    ? { backgroundColor: '#00B07426', color: '#00B074', boxShadow: 'none', borderColor: '#00B074' }
                    : { backgroundColor: '#fff', color: '#000', borderColor: '#e0e6ed' }
                }
              >
                {num + 1}
              </Button>
            ))}
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="sm"
            >
              <span className="text-lg">&#8250;</span>
            </IconButton>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={table.getState().pagination.pageIndex === pageCount - 1}
              size="sm"
            >
              <span className="text-lg">&#187;</span>
            </IconButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TableSellers;
