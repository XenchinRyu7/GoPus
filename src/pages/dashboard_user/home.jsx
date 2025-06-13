import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { PieChart, LineChart, AreaChart, BarChart } from "@/widgets/charts/apex-charts";
import {
  statisticsCardsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import {
  pieChartsData,
  orderLineChart,
  totalRevenueAreaChart,
  customerBarChart,
} from "@/data/apex-charts-data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import banner from "@/../public/img/banner.svg";
import { PuspaCard } from "@/components/PuspaCard";
import { getProducts } from "@/api/product";
import { getToken } from "@/utils/auth";

const placeNames = {
  3: "Puspa Taman Kota",
  1: "Siliwangi",
  2: "Langlangbuana",
};

function getSafeImage(img) {
  if (!img) return undefined;
  if (img.includes("drive.google.com/open?id=")) {
    const id = img.split("id=")[1];
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  if (img.includes("drive.google.com/file/d/")) {
    const match = img.match(/\/d\/([\w-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  if (img.startsWith("/img/")) {
    return img;
  }
  return undefined;
}

export function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const token = getToken();
        const res = await getProducts(token);
        setProducts(res.data || res);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Group products by place_id
  const grouped = { 3: [], 1: [], 2: [] };
  products.forEach((p) => {
    if (p.merchant && grouped[p.merchant.place_id]) {
      grouped[p.merchant.place_id].push(p);
    }
  });

  return (
    <div className="mt-6">
      {/* Banner */}
      <div className="w-full flex justify-center mb-8">
        <img src={banner} alt="Banner" className="rounded-xl w-full max-h-56 object-cover" />
      </div>
      {/* Product Groups by Place */}
      {loading ? (
        <div className="text-center py-10 text-blue-gray-500">Loading products...</div>
      ) : (
        Object.entries(grouped).map(([placeId, list]) =>
          list.length > 0 ? (
            <div key={placeId} className="mb-10">
              <Typography variant="h5" className="mb-4 font-bold text-blue-gray-700">
                {placeNames[placeId]}
              </Typography>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {list.map((product) => (
                  <PuspaCard
                    key={product.id}
                    name={product.name}
                    image={getSafeImage(product.image) || getSafeImage(product.merchant?.image) || "/img/default.jpg"}
                    title={product.name}
                    description={product.description}
                    rating={product.rating}
                    seller={product.merchant?.name || product.seller}
                    location={product.location}
                    category={product.category}
                  />
                ))}
              </div>
            </div>
          ) : null
        )
      )}
      {/* Statistics Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      {/* Pie Charts */}
      <div className="mb-8 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {pieChartsData.map((pie, idx) => (
          <Card key={pie.title} className="flex flex-col items-center py-6 border border-blue-gray-100 shadow-sm">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              {pie.title}
            </Typography>
            <PieChart
              series={[pie.value, 100 - pie.value]}
              options={{
                labels: [pie.title, "Other"],
                colors: [pie.color, "#F3F6F9"],
                dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%` },
                legend: { show: false },
                stroke: { width: 0 },
              }}
              height={160}
            />
            <Typography variant="h4" className="mt-2 font-bold">
              {pie.value}%
            </Typography>
          </Card>
        ))}
      </div>
      {/* Order Line Chart */}
      <div className="mb-8 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6 pb-0">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Chart Order
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <LineChart {...orderLineChart} height={220} />
          </CardBody>
        </Card>
        {/* Customer Map Bar Chart */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6 pb-0">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Customer Map
              </Typography>
              <div className="bg-blue-gray-50 rounded px-2 py-1 text-xs">Weekly</div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <BarChart {...customerBarChart} height={220} />
          </CardBody>
        </Card>
      </div>
      {/* Total Revenue Area Chart */}
      <div className="mb-8">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6 pb-0">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Total Revenue
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            <AreaChart {...totalRevenueAreaChart} height={260} />
          </CardBody>
        </Card>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Projects
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong> this month
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
