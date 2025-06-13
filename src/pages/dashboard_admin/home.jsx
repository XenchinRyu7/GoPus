import React from "react";
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
  getOrdersByPlace
} from "@/api/order";
import {
  useAuthContext
} from "@/context/AuthContext";
import IconOrder from "@/assets/icons/Icon_Order.svg?react";
import IconDelivered from "@/assets/icons/Icon_Delivered.svg?react";
import IconSales from "@/assets/icons/Icon_Sales.svg?react";

export function Home() {
  const {
    user
  } = useAuthContext();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const placeIdByAdmin = {
          "admin@siliwangi.com": 1,
          "admin@langlangbuana.com": 2,
          "admin@tamankota.com": 3,
        };
        const place_id = placeIdByAdmin[user?.email];
        if (!place_id) return setOrders([]);
        const res = await getOrdersByPlace(place_id);
        setOrders(res.data || res);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    if (user?.email) fetchOrders();
  }, [user]);

  // Hitung statistik
  const totalOrders = orders.length;
  const totalKeuntungan = orders
    .filter(o => ["delivered", "confirmed"].includes(o.status))
    .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0); // hanya total_price, tanpa dikurangi delivery_fee
  const pesananMasuk = orders.filter(o => o.status === "pending").length;
  const pesananConfirmed = orders.filter(o => o.status === "confirmed").length;
  const pesananOnDelivery = orders.filter(o => o.status === "on_delivery").length;
  const pesananDelivered = orders.filter(o => o.status === "delivered").length;
  const pesananCancelled = orders.filter(o => o.status === "cancelled").length;

  // Ganti data statistikCardsData dengan data dinamis
  const statisticsCardsData = [
    {
      color: "gray",
      icon: IconOrder,
      title: "Total Orders",
      value: totalOrders,
      footer: { color: "text-blue-500", value: pesananMasuk, label: "pending" },
    },
    {
      color: "gray",
      icon: IconDelivered,
      title: "Delivered",
      value: pesananDelivered,
      footer: { color: "text-green-500", value: pesananConfirmed, label: "confirmed" },
    },
    {
      color: "gray",
      icon: IconOrder,
      title: "On Delivery",
      value: pesananOnDelivery,
      footer: { color: "text-purple-500", value: pesananCancelled, label: "cancelled" },
    },
    {
      color: "gray",
      icon: IconSales,
      title: "Total Keuntungan",
      value: `Rp${totalKeuntungan.toLocaleString("id-ID")}`,
      footer: { color: "text-green-500", value: pesananDelivered, label: "delivered" },
    },
  ];

  // Pie chart dinamis
  const totalOrderCount = orders.length;
  const deliveredConfirmedCount = orders.filter(o => ["delivered", "confirmed"].includes(o.status)).length;
  const uniqueCustomers = new Set(orders.map(o => o.customer?.fullname || o.customer_id)).size;
  const totalRevenue = orders.filter(o => ["delivered", "confirmed"].includes(o.status)).reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

  const pieChartsData = [
    {
      title: 'Total Order',
      value: totalOrderCount > 0 ? Math.round((deliveredConfirmedCount / totalOrderCount) * 100) : 0,
      color: '#F44336',
    },
    {
      title: 'Customer Growth',
      value: uniqueCustomers,
      color: '#4CAF50',
    },
    {
      title: 'Total Revenue',
      value: totalRevenue,
      color: '#2196F3',
    },
  ];

  // Line chart: order per hari (7 hari terakhir)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const orderPerDay = Array(7).fill(0);
  orders.forEach(o => {
    const d = new Date(o.created_at);
    orderPerDay[d.getDay()]++;
  });
  const orderLineChart = {
    series: [
      {
        name: 'Order',
        data: orderPerDay,
      },
    ],
    options: {
      chart: { id: 'order-line', toolbar: { show: false } },
      xaxis: { categories: days },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#2196F3'],
      dataLabels: { enabled: false },
      grid: { show: false },
    },
  };

  // Bar chart: customer per hari (7 hari terakhir)
  const customerPerDay = Array(7).fill(0);
  const customerSetPerDay = Array(7).fill(null).map(() => new Set());
  orders.forEach(o => {
    const d = new Date(o.created_at);
    customerSetPerDay[d.getDay()].add(o.customer?.fullname || o.customer_id);
  });
  for (let i = 0; i < 7; i++) {
    customerPerDay[i] = customerSetPerDay[i].size;
  }
  const customerBarChart = {
    series: [
      {
        name: 'Customer',
        data: customerPerDay,
      },
    ],
    options: {
      chart: { id: 'customer-bar', toolbar: { show: false } },
      xaxis: { categories: days },
      plotOptions: { bar: { horizontal: false, columnWidth: '40%' } },
      colors: ['#FFD600'],
      dataLabels: { enabled: false },
      grid: { show: false },
      legend: { show: true, position: 'top' },
    },
  };

  // Area chart: total revenue per bulan (tahun berjalan)
  const now = new Date();
  const year = now.getFullYear();
  const revenuePerMonth = Array(12).fill(0);
  orders.forEach(o => {
    const d = new Date(o.created_at);
    if (["delivered", "confirmed"].includes(o.status) && d.getFullYear() === year) {
      revenuePerMonth[d.getMonth()] += Number(o.total_price) || 0;
    }
  });
  const totalRevenueAreaChart = {
    series: [
      {
        name: String(year),
        data: revenuePerMonth,
      },
    ],
    options: {
      chart: { id: 'total-revenue-area', toolbar: { show: false } },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      stroke: { curve: 'smooth', width: 3 },
      colors: ['#2196F3'],
      dataLabels: { enabled: false },
      grid: { show: false },
      legend: { show: true, position: 'top' },
    },
  };

  return (
    <div className="mt-12">
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
                <strong className={footer.color}>{footer.value}</strong>&nbsp;{footer.label}
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
                dataLabels: {
                  enabled: true,
                  formatter: (val) => `${Math.round(val)}%`
                },
                legend: {
                  show: false
                },
                stroke: {
                  width: 0
                },
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
    </div>
  );
}

export default Home;
