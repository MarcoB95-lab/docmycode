import { useState, useEffect } from "react";
import Container from "../Container";
import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import Search from "./Search";
import Link from "next/link";

type NavbarProps = {
  session: Session | null;
};

const Navbar = ({ session }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed w-full z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Link href="/">
                <div className="text-xl sm:text-2xl font-bold text-black dark:text-white ml-2 cursor-pointer">
                  DocMyCode
                </div>
              </Link>
            </div>
            {!isMobile && <Search />}
            <div className="flex items-center">
              {isMobile ? (
                <button
                  className="text-3xl font-bold focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  &#9776;
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
      {menuOpen && (
        <div className="dark:bg-gray-800 p-4">
          <div className="flex flex-col items-start">
            <Search />
            {session ? (
              <button
                className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full mt-4"
                onClick={() => signOut()}
              >
                Logout
              </button>
            ) : (
              <Link href="/auth">
                <button className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full mt-4">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
