import React from "react";
import { Card, Typography, Avatar } from "@material-tailwind/react";
import { StarIcon } from "@heroicons/react/24/solid";

export function PuspaCard({ name, seller, location, category, image, rating }) {
  return (
    <Card className="w-64 min-w-[256px] bg-white rounded-xl shadow-md overflow-hidden p-0 flex flex-col">
      <div className="w-full aspect-[4/3] bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center rounded-t-xl"
        />
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <Typography variant="h6" className="font-bold truncate mb-1" color="blue-gray">
          {name}
        </Typography>
        <Typography variant="small" className="text-xs text-blue-gray-500 truncate">
          {seller} • {location} • {category}
        </Typography>
        <div className="flex items-center gap-1 mt-2">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <Typography variant="small" className="text-xs font-semibold text-blue-gray-700">
            {rating}
          </Typography>
        </div>
      </div>
    </Card>
  );
}

export default PuspaCard;
