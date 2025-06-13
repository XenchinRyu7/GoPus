import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { getUserRole } from "@/utils/auth";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const role = getUserRole();
  const filteredRoutes = routes.map((route) =>
    route.layout === "dashboard"
      ? {
          ...route,
          pages: route.pages.filter((page) => !page.role || page.role === role),
        }
      : route
  );

  // Cek jika tidak ada halaman yang bisa diakses
  const dashboardRoutes = filteredRoutes.find((r) => r.layout === "dashboard");
  const hasPages =
    dashboardRoutes &&
    dashboardRoutes.pages &&
    dashboardRoutes.pages.length > 0;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={filteredRoutes.filter((route) => route.layout === "dashboard")}
        brandImg={
          sidenavType === "dark" ? "/img/gopus_logo.png" : "/img/gopus_logo.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {hasPages ? (
            filteredRoutes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element }, idx) => (
                  <Route key={path || idx} exact path={path} element={element} />
                ))
            )
          ) : (
            <Route
              path="*"
              element={
                <div className="p-8 text-center text-red-500">
                  Tidak ada halaman yang bisa diakses untuk role ini.
                </div>
              }
            />
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
