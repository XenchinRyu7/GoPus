import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { isAuthenticated, clearAuth } from "@/utils/auth";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { useAuthContext } from "@/context/AuthContext";
import { getOrdersByPlace } from "@/api/order";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { user } = useAuthContext();
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    async function fetchPendingOrders() {
      if (!user?.email) return setPendingOrders([]);
      const placeIdByAdmin = {
        "admin@siliwangi.com": 1,
        "admin@langlangbuana.com": 2,
        "admin@tamankota.com": 3,
      };
      const place_id = placeIdByAdmin[user.email];
      if (!place_id) return setPendingOrders([]);
      try {
        const res = await getOrdersByPlace(place_id);
        const orders = res.data || res;
        setPendingOrders(orders.filter((o) => o.status === "pending"));
      } catch {
        setPendingOrders([]);
      }
    }
    fetchPendingOrders();
  }, [user]);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize flex items-center gap-2">
          <div className="xl:hidden">
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setOpenSidenav(dispatch, true)}
              className="mr-2"
            >
              <Bars3Icon className="h-6 w-6" />
            </IconButton>
          </div>
          <div>
            <Breadcrumbs
              className={`hidden md:inline-flex bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}
            >
              <Link to={`/${layout}`}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
                >
                  {layout}
                </Typography>
              </Link>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {page}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h6" color="blue-gray" className="hidden md:block">
              {page}
            </Typography>
          </div>
        </div>
        <div className="flex items-center">

          <div className="hidden md:block mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <span className="mx-4 text-blue-gray-200 text-xl select-none xl:block hidden">|</span>

          {/* User Avatar & Dropdown */}
          <UserMenu />
          <Menu className="hidden xl:block">
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              {pendingOrders.length === 0 && (
                <MenuItem className="flex items-center gap-3">
                  <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                    Tidak ada order pending
                  </Typography>
                </MenuItem>
              )}
              {pendingOrders.map((order, idx) => (
                <MenuItem key={order.id || idx} className="flex items-center gap-3">
                  <Avatar
                    src={order.customer?.image ? `http://localhost:3000/uploads/${order.customer.image}` : "/img/placeholder.png"}
                    alt={order.customer?.fullname || "customer"}
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                      <strong>Order Pending</strong> dari {order.customer?.fullname || order.customer_id}
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs font-normal opacity-60">
                      <ClockIcon className="h-3.5 w-3.5" /> {new Date(order.created_at).toLocaleString("id-ID")}
                    </Typography>
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
            className="hidden xl:inline-flex"
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user_data");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/auth/sign-in", { replace: true });
  };

  if (!user) return null;

  const displayName = user.fullname || user.email?.split("@")[0] || "User";

  return (
    <Menu open={open} handler={setOpen} placement="bottom-end">
      <MenuHandler>
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <span className="font-semibold text-blue-gray-700">Hello, {displayName}</span>
          <Avatar
             src={user?.image ? `http://localhost:3000/uploads/${user.image}` : "/img/placeholder.png"}
            alt="user"
            size="sm"
            variant="circular"
          />
        </div>
      </MenuHandler>
      <MenuList className="w-40">
        <MenuItem
          onClick={() => {
            setOpen(false);
            navigate("/dashboard/profile");
          }}
        >
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} className="text-red-500">
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
