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
import { getProducts } from "@/api/product";
import { getSellers } from "@/api/seller";
import { addProduct, updateProduct, deleteProduct } from "@/api/product";
import ProductViewModal from "./components/ProductViewModal";
import ProductAddEditModal from "./components/ProductAddEditModal";
import { getToken, getUserData } from "@/utils/auth";

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

const TableProducts = () => {
  const columns = React.useMemo(
    () => [
      {
        header: "Nama Produk",
        accessorKey: "name",
        cell: (info) => (
          <span className="block max-w-[140px] truncate text-xs font-medium text-blue-gray-800">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Deskripsi",
        accessorKey: "description",
        cell: (info) => (
          <span className="block max-w-[200px] truncate text-xs text-blue-gray-600">
            {info.getValue() || "-"}
          </span>
        ),
      },
      {
        header: "Harga",
        accessorKey: "price",
        cell: (info) =>
          Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(Number(info.getValue())),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => info.getValue(),
      },
      {
        header: "Tipe",
        accessorKey: "type",
        cell: (info) => info.getValue(),
      },
      {
        header: "Merchant",
        accessorKey: "merchant.name",
        cell: (info) => info.row.original.merchant?.name || "-",
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
                <MenuItem className="flex items-center gap-2" onClick={() => { setSelectedProduct(info.row.original); setViewOpen(true); }}>
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
  const [merchants, setMerchants] = React.useState([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [addForm, setAddForm] = React.useState({ name: "", description: "", price: "", image: "", merchant_id: "", status: "available" });
  const [addImageFile, setAddImageFile] = React.useState(null);
  const [addSaving, setAddSaving] = React.useState(false);
  const [addError, setAddError] = React.useState("");
  const [editForm, setEditForm] = React.useState(null);
  const [editImageFile, setEditImageFile] = React.useState(null);
  const [editSaving, setEditSaving] = React.useState(false);
  const [editError, setEditError] = React.useState("");

  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const token = getToken();
        const user = getUserData();
        if (!token || !user) return;
        const res = await getProducts(token);
        let products = res.data || res;
        const adminEmail = user.email;
        const placeId = placeIdByAdmin[adminEmail];
        if (placeId) {
          products = products.filter((p) => p.merchant && p.merchant.place_id === placeId);
        }
        setData(products);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  React.useEffect(() => {
    async function fetchMerchants() {
      const token = getToken();
      const user = getUserData();
      if (!token || !user) return;
      const res = await getSellers(token);
      let sellers = res.data || res;
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) sellers = sellers.filter((s) => s.place_id === placeId);
      setMerchants(sellers);
    }
    fetchMerchants();
  }, []);

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
      await addProduct(token, formData, true);
      setAddOpen(false);
      setAddForm({ name: "", description: "", price: "", image: "", merchant_id: "", status: "available" });
      setAddImageFile(null);
      // Refresh products
      const res = await getProducts(token);
      let products = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) products = products.filter((p) => p.merchant && p.merchant.place_id === placeId);
      setData(products);
    } catch (e) {
      setAddError("Gagal menambah produk");
    } finally {
      setAddSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditForm({ ...product, merchant_id: product.merchant_id || product.merchant?.id || "" });
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
      await updateProduct(token, editForm.id, formData, true);
      setEditOpen(false);
      setEditForm(null);
      setEditImageFile(null);
      // Refresh products
      const res = await getProducts(token);
      let products = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) products = products.filter((p) => p.merchant && p.merchant.place_id === placeId);
      setData(products);
    } catch (e) {
      setEditError("Gagal update produk");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Yakin hapus produk ${product.name}?`)) return;
    try {
      const token = getToken();
      await deleteProduct(token, product.id);
      // Refresh products
      const res = await getProducts(token);
      let products = res.data || res;
      const user = getUserData();
      const adminEmail = user.email;
      const placeId = placeIdByAdmin[adminEmail];
      if (placeId) products = products.filter((p) => p.merchant && p.merchant.place_id === placeId);
      setData(products);
    } catch (e) {
      alert("Gagal menghapus produk");
    }
  };

  if (loading) {
    return (
      <Card className="h-full w-full p-4 flex items-center justify-center">
        <Typography variant="h6">Loading sellers...</Typography>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full p-4">
      <CardBody className="overflow-x-auto px-0">
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
            <Button color="green" onClick={handleAddOpen} className="ml-2">+ Add Product</Button>
          </div>
        </div>
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
      <ProductViewModal open={viewOpen} onClose={() => setViewOpen(false)} product={selectedProduct} merchantName={selectedProduct?.merchant?.name || "-"} />
      <ProductAddEditModal open={addOpen} onClose={handleAddOpen} form={addForm} onChange={handleAddChange} onSave={handleAddSave} saving={addSaving} error={addError} onImageChange={handleAddImageChange} imageFile={addImageFile} merchants={merchants} isEdit={false} />
      <ProductAddEditModal open={editOpen} onClose={() => setEditOpen(false)} form={editForm || {}} onChange={handleEditChange} onSave={handleEditSave} saving={editSaving} error={editError} onImageChange={handleEditImageChange} imageFile={editImageFile} merchants={merchants} isEdit={true} />
    </Card>
  );
};

export default TableProducts;
