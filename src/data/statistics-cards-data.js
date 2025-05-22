import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

import IconOrder from "./../assets/icons/Icon_Order.svg?react";
import IconDelivered from "./../assets/icons/Icon_Delivered.svg?react";
import IconSales from "./../assets/icons/Icon_Sales.svg?react";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: IconOrder,
    title: "Total Transaksi",
    value: "$53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "gray",
    icon: IconDelivered,
    title: "Total Pengiriman",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "gray",
    icon: IconOrder,
    title: "Pesanan Masuk",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "gray",
    icon: IconSales,
    title: "Total Penjualan",
    value: "$103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "than yesterday",
    },
  },
];

export default statisticsCardsData;
