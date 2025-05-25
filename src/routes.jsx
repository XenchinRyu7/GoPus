import {
  // HomeIcon,
  // UserCircleIcon,
  // TableCellsIcon,
  // InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { UserIcon, HomeIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { Home, Profile, Tables, Notifications, TableUsers, TableSellers, TableOrders } from "@/pages/dashboard_admin";
import { HomeUser } from "@/pages/dashboard_user";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      // ADMIN ROUTES
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />, 
        role: "admin",
      },
      {
        icon: <Bars4Icon {...icon} />,
        name: "Pesananan",
        path: "/orders",
        element: <TableOrders />, 
        role: "admin",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Pedagang",
        path: "/sellers",
        element: <TableSellers />, 
        role: "admin",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Users",
        path: "/users",
        element: <TableUsers />, 
        role: "admin",
      },
      // USER ROUTES
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/home",
        element: <HomeUser />, 
        role: "user",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Puspa Taman Kota",
        path: "/puspa-taman-kota",
        element: <div>Puspa Taman Kota</div>,
        role: "user",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Siliwangi",
        path: "/siliwangi",
        element: <div>Siliwangi</div>,
        role: "user",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Langlangbuana",
        path: "/langlangbuana",
        element: <div>Langlangbuana</div>,
        role: "user",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Pesanan Saya",
        path: "/pesanan-saya",
        element: <div>Pesanan Saya</div>,
        role: "user",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Riwayat Pembelian",
        path: "/riwayat-pembelian",
        element: <div>Riwayat Pembelian</div>,
        role: "user",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <div>Profile</div>,
        role: "user",
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
