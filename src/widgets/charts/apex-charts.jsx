import React from "react";
import ReactApexChart from "react-apexcharts";

export function LineChart({ series, options, height = 250 }) {
  return <ReactApexChart type="line" series={series} options={options} height={height} />;
}

export function AreaChart({ series, options, height = 250 }) {
  return <ReactApexChart type="area" series={series} options={options} height={height} />;
}

export function PieChart({ series, options, height = 200 }) {
  return <ReactApexChart type="pie" series={series} options={options} height={height} />;
}

export function BarChart({ series, options, height = 250 }) {
  return <ReactApexChart type="bar" series={series} options={options} height={height} />;
}
