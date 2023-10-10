import React from "react";

export default function Header() {
  return (
    <div className="flex items-center justify-center flex-col bg-[#3a2857] h-[20rem]">
      <h1 className="text-3xl sm:text-4xl xl:text-6xl font-bold text-white">
        Stackbuld Blog
      </h1>
      <span className="italic text-gray-200 block">be up to date here</span>
    </div>
  );
}
