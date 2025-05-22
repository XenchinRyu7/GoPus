import { faker } from '@faker-js/faker';

export const pieChartsData = [
  {
    title: 'Total Order',
    value: faker.number.int({ min: 70, max: 99 }),
    color: '#F44336',
  },
  {
    title: 'Customer Growth',
    value: faker.number.int({ min: 10, max: 40 }),
    color: '#4CAF50',
  },
  {
    title: 'Total Revenue',
    value: faker.number.int({ min: 50, max: 80 }),
    color: '#2196F3',
  },
];

export const orderLineChart = {
  series: [
    {
      name: 'Order',
      data: Array.from({ length: 7 }, () => faker.number.int({ min: 200, max: 800 })),
    },
  ],
  options: {
    chart: { id: 'order-line', toolbar: { show: false } },
    xaxis: { categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#2196F3'],
    dataLabels: { enabled: false },
    grid: { show: false },
  },
};

// Area Chart (Total Revenue)
export const totalRevenueAreaChart = {
  series: [
    {
      name: '2020',
      data: Array.from({ length: 12 }, () => faker.number.int({ min: 10000, max: 40000 })),
    },
    {
      name: '2021',
      data: Array.from({ length: 12 }, () => faker.number.int({ min: 15000, max: 50000 })),
    },
  ],
  options: {
    chart: { id: 'total-revenue-area', toolbar: { show: false } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#2196F3', '#F44336'],
    dataLabels: { enabled: false },
    grid: { show: false },
    legend: { show: true, position: 'top' },
  },
};

export const customerBarChart = {
  series: [
    {
      name: '2020',
      data: Array.from({ length: 5 }, () => faker.number.int({ min: 20, max: 80 })),
    },
    {
      name: '2021',
      data: Array.from({ length: 5 }, () => faker.number.int({ min: 30, max: 90 })),
    },
  ],
  options: {
    chart: { id: 'customer-bar', toolbar: { show: false } },
    xaxis: { categories: ['Sun', 'Sun', 'Sun', 'Sun', 'Sun'] },
    plotOptions: { bar: { horizontal: false, columnWidth: '40%' } },
    colors: ['#FFD600', '#F44336'],
    dataLabels: { enabled: false },
    grid: { show: false },
    legend: { show: true, position: 'top' },
  },
};
