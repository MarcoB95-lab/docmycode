import Container from "../Container";
import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import Search from "./Search";
import Link from "next/link";

type NavbarProps = {
  session: Session | null;
};

const Navbar = ({ session }: NavbarProps) => {
  return (
    <div className="fixed w-full z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <div className="flex flex-row items-center">
              <Link href="/">
                <div className="text-2xl font-bold text-black dark:text-white ml-2 cursor-pointer">
                  DocMyCode
                </div>
              </Link>
            </div>
            <Search />
            <div>
              {session ? (
                <button
                  className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              ) : (
                <Link href="/auth">
                  <button className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
