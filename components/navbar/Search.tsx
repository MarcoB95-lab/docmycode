'use client';
import Link from "next/link";

const Search = () => {
  return (
    <div className="flex flex-row items-center justify-between text-black mx-auto ">
      <Link href="/docmycode">
        <div className="text-sm font-semibold px-6 cursor-pointer sm:text-xl hover:opacity-60">
          Document my Code
        </div>
      </Link>
      <Link href="/contact">
        <div className="text-sm sm:text-xl font-semibold px-6 text-center cursor-pointer border-l-[1px] border-gray-300 hover:opacity-60">
          Contact Us
        </div>
      </Link>
    </div>
  );
};

export default Search;
