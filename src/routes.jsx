import {
  // HomeIcon,
  // UserCircleIcon,
  // TableCellsIcon,
  // InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { UserIcon, HomeIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { Home, Profile, Tables, Notifications, TableUsers, TableSellers, TableOrders } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      // {
      //   icon: <Bars4Icon {...icon} />,
      //   name: "Pesanan",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <UserIcon {...icon} />,
      //   name: "Pedagang",
      //   path: "/tables",
      //   element: <Tables />,
      // },

      {
        icon: <Bars4Icon {...icon} />,
        name: "Pesananan",
        path: "/orders",
        element: <TableOrders />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "Pelanggan",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
      {
        icon: <UserIcon {...icon} />,
        name: "Pedagang",
        path: "/sellers",
        element: <TableSellers />,
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Users",
        path: "/users",
        element: <TableUsers />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
