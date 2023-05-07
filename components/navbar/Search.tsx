'use client';
import Link from "next/link";

const Search = () => {
  return (
    <div className="flex flex-row items-center justify-between text-black">
      <Link href="/docmycode">
        <div className="text-xl font-semibold px-6 cursor-pointer">
          Document my Code
        </div>
      </Link>
      <Link href="/contact">
        <div className="hidden sm:block text-xl font-semibold px-6 text-center cursor-pointer border-l-[1px] border-gray-300">
          Contact Us
        </div>
      </Link>
    </div>
  );
};

export default Search;
