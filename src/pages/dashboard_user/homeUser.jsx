import React from "react";
import banner from "@/../public/img/banner.svg";
import { PuspaCard } from "@/components/PuspaCard";
import { PuspaSection } from "@/components/PuspaSection";
import { faker } from "@faker-js/faker";

export function HomeUser() {
  const puspaData = [
    {
      title: "Puspa Taman Kota",
      subtitle: "Aneka jajanan di Puspa Taman Kota",
      data: Array.from({ length: 6 }).map(() => ({
        name: faker.commerce.productName(),
        seller: faker.company.name(),
        location: faker.location.city(), 
        category: faker.commerce.department(),
        image: faker.image.urlLoremFlickr({ width: 320, height: 240, category: 'food' }),
        rating: (4 + Math.random()).toFixed(1),
      })),
    },
    {
      title: "Puspa Siliwangi",
      subtitle: "Aneka jajanan di Puspa Siliwangi",
      data: Array.from({ length: 6 }).map(() => ({
        name: faker.commerce.productName(),
        seller: faker.company.name(),
        location: faker.location.city(),
        category: faker.commerce.department(),
        image: faker.image.urlLoremFlickr({ width: 320, height: 240, category: 'food' }),
        rating: (4 + Math.random()).toFixed(1),
      })),
    },
    {
      title: "Puspa Langlangbuana",
      subtitle: "Aneka jajanan di Puspa Langlangbuana",
      data: Array.from({ length: 6 }).map(() => ({
        name: faker.commerce.productName(),
        seller: faker.company.name(),
        location: faker.location.city(),
        category: faker.commerce.department(),
        image: faker.image.urlLoremFlickr({ width: 320, height: 240, category: 'food' }),
        rating: (4 + Math.random()).toFixed(1),
      })),
    },
  ];

  return (
    <div className="mt-6">
      {/* Banner */}
      <div className="w-full flex justify-center mb-8">
        <img src={banner} alt="Banner" className="rounded-xl w-full max-h-56 object-cover" />
      </div>
      {/* Puspa Sections */}
      {puspaData.map((puspa, idx) => (
        <PuspaSection key={puspa.title} title={puspa.title} subtitle={puspa.subtitle} data={puspa.data} />
      ))}
    </div>
  );
}

export default HomeUser;
