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
import { twMerge } from "tailwind-merge";
import { rankItem } from "@tanstack/match-sorter-utils";
import { getUsers, getUser, updateUser, deleteUser } from "@/api/user";
import { getToken } from "@/utils/auth";
import { UserViewModal, UserEditModal, UserDeleteModal } from "./components/UserModals";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};


const TableUsers = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [editUser, setEditUser] = React.useState(null);
  const [editError, setEditError] = React.useState("");
  const [editSaving, setEditSaving] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) return;
        const res = await getUsers(token);
        let users = res.data || res;
        users = users.filter((u) => u.role === "customer");
        setData(users);
      } catch (e) {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const columns = React.useMemo(
    () => [
      { header: "Nama", accessorKey: "fullname", cell: (info) => info.getValue() },
      { header: "Email", accessorKey: "email", cell: (info) => info.getValue() },
      { header: "No. Telp", accessorKey: "phone", cell: (info) => info.getValue() || "-" },
      { header: "Alamat", accessorKey: "address", cell: (info) => info.getValue() || "-" },
      { header: "Status", accessorKey: "status", cell: (info) => info.getValue() },
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
                <MenuItem className="flex items-center gap-2" onClick={() => handleView(info.row.original.id)}>
                  <EyeSolid className="h-4 w-4 stroke-2" /> View
                </MenuItem>
                <MenuItem className="flex items-center gap-2" onClick={() => handleEdit(info.row.original.id)}>
                  <EditPencil className="h-4 w-4 stroke-2" /> Edit
                </MenuItem>
                <MenuItem className="flex items-center gap-2 text-red-500" onClick={() => handleDelete(info.row.original.id)}>
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

  // Handler for view
  const handleView = async (userId) => {
    const token = getToken();
    try {
      const user = await getUser(token, userId);
      setSelectedUser(user.data || user);
      setViewOpen(true);
    } catch (e) {
      setSelectedUser(null);
      setViewOpen(false);
    }
  };

  // Handler for edit
  const handleEdit = async (userId) => {
    const token = getToken();
    try {
      const user = await getUser(token, userId);
      setEditUser(user.data || user);
      setEditOpen(true);
      setEditError("");
    } catch (e) {
      setEditUser(null);
      setEditOpen(false);
    }
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSave = async () => {
    setEditSaving(true);
    setEditError("");
    const token = getToken();
    try {
      await updateUser(token, editUser.id, editUser);
      setEditOpen(false);
      setEditUser(null);
      // Refresh users
      const res = await getUsers(token);
      let users = res.data || res;
      users = users.filter((u) => u.role === "customer");
      setData(users);
    } catch (e) {
      setEditError("Gagal update user");
    } finally {
      setEditSaving(false);
    }
  };

  // Handler for delete
  const handleDelete = async (userId) => {
    setDeleteOpen(true);
    setSelectedUser({ id: userId });
  };
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    const token = getToken();
    try {
      await deleteUser(token, selectedUser.id);
      setDeleteOpen(false);
      setSelectedUser(null);
      // Refresh users
      const res = await getUsers(token);
      let users = res.data || res;
      users = users.filter((u) => u.role === "customer");
      setData(users);
    } catch (e) {
      // handle error
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
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
      </Card>
      <UserViewModal open={viewOpen} onClose={() => setViewOpen(false)} user={selectedUser} />
      <UserEditModal open={editOpen} onClose={() => setEditOpen(false)} user={editUser} onChange={handleEditChange} onSave={handleEditSave} saving={editSaving} error={editError} />
      <UserDeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onDelete={handleDeleteConfirm} deleting={deleteLoading} />
    </>
  );
};

export default TableUsers;
