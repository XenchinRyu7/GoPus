import { UserIcon, HomeIcon } from "@heroicons/react/24/outline";
import { 
  // Dummy components for now, replace with real ones if available
} from "react";
import { 
  Home as UserHome 
} from "@/pages/dashboard_user/home";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const userRoutes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />, name: "Dashboard", path: "/home", element: <UserHome />,
      },
      {
        icon: <UserIcon {...icon} />, name: "Puspa Taman Kota", path: "/puspa-taman-kota", element: <div>Puspa Taman Kota</div>,
      },
      {
        icon: <UserIcon {...icon} />, name: "Siliwangi", path: "/siliwangi", element: <div>Siliwangi</div>,
      },
      {
        icon: <UserIcon {...icon} />, name: "Langlangbuana", path: "/langlangbuana", element: <div>Langlangbuana</div>,
      },
      {
        icon: <UserIcon {...icon} />, name: "Pesanan Saya", path: "/pesanan-saya", element: <div>Pesanan Saya</div>,
      },
      {
        icon: <UserIcon {...icon} />, name: "Riwayat Pembelian", path: "/riwayat-pembelian", element: <div>Riwayat Pembelian</div>,
      },
      {
        icon: <UserIcon {...icon} />, name: "Profile", path: "/profile", element: <div>Profile</div>,
      },
    ],
  },
];

export default userRoutes;
