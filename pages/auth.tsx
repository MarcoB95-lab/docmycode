import axios from "axios";
import { useCallback, useState } from "react";
import { NextPageContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Head from "next/head";
import Input from "@/components/Input";
import Footer from "@/components/Footer";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Auth = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [variant, setVariant] = useState("login");

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        name,
        password,
      });

      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  return (
    <>
      <Head>
      <title>DocMyCode - Code Documentation Made Easy</title>
        <meta
          name="description"
          content="Easily create, manage, and share code documentation in one place. DocMyCode (Document my Code) lets you explain your code and keep your documentation up-to-date."
        />
        <meta
          property="og:title"
          content="DocMyCode - Code Documentation Made Easy"
        />
        <meta
          property="og:description"
          content="Easily create, manage, and share code documentation in one place. DocMyCode (Document my Code) lets you explain your code and keep your documentation up-to-date."
        />
        <meta
          name="keywords"
          content="code documentation, document my code, programming, coding, API documentation, inline comments, docstrings, code block comments, code explanations, coding best practices"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-start-gradient to-end-gradient flex items-center justify-center">
        <div className="bg-white w-full max-w-md p-8 rounded-md shadow-md">
          <h3 className="text-2xl font-semibold mb-2 text-center">
            Welcome to DocMyCode.
          </h3>
          <p className="text-lg text-center mb-5">
            Easily create, manage, and share code documentation in one place.
          </p>
          <div className="flex flex-col gap-4">
            {variant === "register" && (
              <Input
                id="name"
                type="text"
                label="Username"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
            )}
            <Input
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              id="password"
              label="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={variant === "login" ? login : register}
            className="py-3 text-white rounded-md w-full mt-6 transition"
            style={{
              backgroundColor: "#19547b",
              cursor: "pointer",
            }}
          >
            {variant === "login" ? "Sign in" : "Sign up"}
          </button>
          <div className="relative mt-7">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              onClick={() =>
                signIn("google", { callbackUrl: "/" })
              }
              className="mt-4 flex items-center gap-2  text-gray-800 rounded-md text-xl shadow-md py-2 px-8"
            >
              <FcGoogle size={32} />
              <span className="text-xl">Sign in with Google</span>
            </button>
            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="mt-4 flex items-center gap-2 bg-slate-50 text-gray-800 rounded-md text-xl shadow-md py-2 px-8"
            >
              <FaGithub size={32} />
              <span className="text-xl">Sign in with GitHub</span>
            </button>
          </div>
          <p className="text-gray-500 mt-8">
            {variant === "login"
              ? "First time here?"
              : "Already have an account?"}
            <span
              onClick={toggleVariant}
              className="ml-1 hover:underline cursor-pointer"
              style={{
                color: "#19547b",
                cursor: "pointer",
              }}
            >
              {variant === "login" ? "Create an account" : "Login"}
            </span>
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Auth;
