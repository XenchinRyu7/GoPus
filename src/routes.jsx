import { UserIcon, HomeIcon, Bars4Icon } from "@heroicons/react/24/outline";
import { Home, Profile, Tables, Notifications, TableUsers, TableSellers, TableOrders, TableProducts } from "@/pages/dashboard_admin";
import { HomeUser, Product, HistoryPayment, Orders, ProfileUser } from "@/pages/dashboard_user";
import { SignIn, SignUp } from "@/pages/auth";
import { ProductDetail } from "@/pages/dashboard_user/productDetail";
import MerchantProducts from "@/pages/dashboard_user/merchantProducts";

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
      {
        icon: <UserIcon {...icon} />,
        name: "Products",
        path: "/products",
        element: <TableProducts />,
        role: "admin",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <ProfileUser />, // Komponen profile untuk admin
        role: "admin",
      },
      // USER ROUTES
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/home",
        element: <HomeUser />, 
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Puspa Taman Kota",
        path: "/puspa-taman-kota",
        element:<Product />,
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Siliwangi",
        path: "/siliwangi",
        element: <Product />,
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Langlangbuana",
        path: "/langlangbuana",
        element: <Product />,
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Pesanan Saya",
        path: "/pesanan-saya",
        element: <Orders />,
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Riwayat Pembelian",
        path: "/riwayat-pembelian",
        element: <HistoryPayment />,
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <ProfileUser />, // Komponen profile untuk customer
        role: "customer",
      },
      {
        name: "Product Detail",
        path: "/product/:id",
        element: <ProductDetail />, // detail produk
        role: "customer",
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Produk Merchant",
        path: "/merchant/:merchant_id",
        element: <MerchantProducts />, // Halaman produk merchant
        role: "customer",
      },
    ],
  },
  {
    layout: "auth",
    pages: [
      {
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        name: "Sign Up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
