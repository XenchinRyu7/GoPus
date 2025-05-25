import React from "react";
import { Typography, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import PuspaCard from "@/components/PuspaCard";

export function PuspaSection({ title, subtitle, data }) {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <Typography variant="h6" className="font-bold text-blue-gray-800 mb-0.5">{title}</Typography>
          <Typography variant="small" className="text-xs text-blue-gray-500">{subtitle}</Typography>
        </div>
        <div className="flex gap-1">
          <IconButton size="sm" variant="text" onClick={() => scroll("left")}> <ChevronLeftIcon className="w-5 h-5" /> </IconButton>
          <IconButton size="sm" variant="text" onClick={() => scroll("right")}> <ChevronRightIcon className="w-5 h-5" /> </IconButton>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {data.map((item, idx) => (
          <PuspaCard key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

export default PuspaSection;
