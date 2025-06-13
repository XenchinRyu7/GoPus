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
import { getOrdersByCustomer } from "@/api/order";
import { useAuthContext } from "@/context/AuthContext";
import OrderViewModal from "./OrderViewModal";
import PaymentDialog from "./PaymentDialog";

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

const statusBadge = (status) => {
  let badgeClass = "";
  let text = status;
  if (status === "pending") {
    badgeClass = "bg-yellow-50 text-yellow-700 border border-yellow-200";
    text = "Pending";
  } else if (status === "confirmed") {
    badgeClass = "bg-blue-50 text-blue-700 border border-blue-200";
    text = "Confirmed";
  } else if (status === "on_delivery") {
    badgeClass = "bg-purple-50 text-purple-700 border border-purple-200";
    text = "On Delivery";
  } else if (status === "delivered") {
    badgeClass = "bg-green-50 text-green-700 border border-green-200";
    text = "Delivered";
  } else if (status === "cancelled") {
    badgeClass = "bg-red-50 text-red-700 border border-red-200";
    text = "Cancelled";
  } else {
    badgeClass = "bg-blue-gray-50 text-blue-gray-700 border border-blue-gray-200";
  }
  return <span className={`px-3 py-1 rounded-lg text-xs font-semibold inline-block ${badgeClass}`}>{text}</span>;
};

const Orders = () => {
  const { user } = useAuthContext();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false);
  const [selectedPayOrder, setSelectedPayOrder] = React.useState(null);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        if (!user?.id) return;
        const res = await getOrdersByCustomer(user.id);
        // Filter hanya status selain delivered & cancelled
        const filtered = (res.data || res).filter(o => o.status !== "delivered" && o.status !== "cancelled");
        setData(filtered);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const columns = React.useMemo(
    () => [
      {
        header: "Nama Pemesan",
        accessorKey: "customer.fullname",
        cell: (info) => info.row.original.customer?.fullname || "-",
      },
      {
        header: "Merchant",
        accessorKey: "merchant.name",
        cell: (info) => info.row.original.merchant?.name || "-",
      },
      {
        header: "Alamat Pengiriman",
        accessorKey: "delivery_address",
        cell: (info) => info.row.original.delivery_address,
      },
      {
        header: "Harga",
        accessorKey: "total_price",
        cell: (info) =>
          Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(Number(info.row.original.total_price)),
      },
      {
        header: "Delivery Fee",
        accessorKey: "delivery_fee",
        cell: (info) =>
          Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(Number(info.row.original.delivery_fee)),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => statusBadge(info.row.original.status),
      },
      {
        header: "Tanggal",
        accessorKey: "created_at",
        cell: (info) => new Date(info.row.original.created_at).toLocaleString("id-ID"),
      },
      {
        header: "",
        accessorKey: "action",
        cell: (info) => (
          <div className="w-full text-end flex gap-2 justify-end">
            <Button size="sm" variant="text" color="blue" onClick={() => { setSelectedOrder(info.row.original); setShowViewModal(true); }}>
              <EyeSolid className="h-4 w-4 stroke-2" /> View
            </Button>
            {info.row.original.status === "pending" && (
              <Button size="sm" variant="outlined" color="green" onClick={() => { setSelectedPayOrder(info.row.original); setShowPaymentDialog(true); }}>
                Pay
              </Button>
            )}
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
      <OrderViewModal open={showViewModal} onClose={() => setShowViewModal(false)} order={selectedOrder} />
      <PaymentDialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} order={selectedPayOrder} />
    </>
  );
};

export default Orders;
