'use client';

import ToyFilter from "../../components/all-toys/Side-Bar";

export default function AllToysLayout({ children }) {
  return (
    <div className="all-toys-layout p-4">

      <div className="flex gap-6">
        {/* Left Section: Filters */}
        <aside className="w-1/5 bg-gray-100 p-4 rounded sticky top-4 h-fit">          
          <p>Hi</p>
          <ToyFilter />
        </aside>

        {/* Right Section: Toy List */}
        <main className="w-4/5">
          {children}
        </main>
      </div>
    </div>
  );
}