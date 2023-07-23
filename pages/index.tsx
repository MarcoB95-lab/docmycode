import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { NextPageContext } from "next";
import Navbar from "@/components/navbar/Navbar";
import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "@/components/Footer";

type HomeProps = {
  session: Session | null;
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession({ req: context.req });

  return {
    props: {
      session: session,
    },
  };
}

export default function Home({ session }: HomeProps) {
  const [email, setEmail] = useState("");

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setEmail("");
      alert("You have successfully subscribed to the newsletter.");
    } else {
      const { error } = await response.json();
      alert(error);
    }
  }

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
      <div className="min-h-screen bg-gradient-to-br from-start-gradient to-end-gradient">
        <Navbar session={session} />
        <div className="flex flex-col items-center justify-center px-2 pt-40 ">
          <div className="flex flex-col items-center justify-center mb-20">
            <h3 className="text-5xl font-semibold mb-2 text-center">
              Welcome to DocMyCode.
            </h3>
            <p className="text-2xl text-center">
              Easily create, manage, and share code documentation in one place.
            </p>
          </div>
          <div className="flex flex-col justify-center w-full text-center md:flex-row">
            <div className="flex flex-col items-center justify-center mx-5">
              <div className="flex items-center justify-center mb-5">
                <SunIcon className="h-10 w-10" />
                <h2 className="ml-2"> How to use </h2>
              </div>
              <div className="space-y-2 mb-5">
                <p className="infoText">
                  Paste your code and select the desired documentation style by
                  checking the appropriate checkbox.
                </p>
                <p className="infoText">
                  Click submit to generate documentation or explanations
                  tailored to your code.
                </p>
                <p className="infoText">
                  Review the output, copy it using the copy button, and
                  integrate it into your project.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mx-5">
              <div className="flex items-center justify-center mb-5">
                <BoltIcon className="h-10 w-10" />
                <h2 className="ml-2"> Capabilities </h2>
              </div>
              <div className="space-y-2 mb-5">
                <p className="infoText">
                  Automatically generate inline comments, docstrings, and code
                  block comments for a variety of programming languages.
                </p>
                <p className="infoText">
                  Generate API documentation in a user-friendly and readable
                  format.
                </p>
                <p className="infoText">
                  Provide code explanations to help users understand complex or
                  unfamiliar code snippets.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mx-5">
              <div className="flex items-center justify-center mb-5">
                <ExclamationTriangleIcon className="h-10 w-10" />
                <h2 className="ml-2"> Limitations </h2>
              </div>
              <div className="space-y-2 mb-5">
                <p className="infoText">
                  In some cases, generated information might be incorrect,
                  requiring manual review.
                </p>
                <p className="infoText">
                  There is a possibility of producing harmful instructions or
                  biased content unintentionally; user discretion is advised.
                </p>
                <p className="infoText">
                  Limited knowledge of world and events after 2021.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center mt-10">
            <Link
              className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              href="/docmycode"
            >
              Get Started
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-4 mt-10">
            DocMyCode Newsletter
          </h1>
          <div className="w-11/12 md:w-2/5">
            <p className="text-xl text-center mb-8">
              Subscribe to the DocMyCode Newsletter for the latest in code
              documentation, best practices, industry trends, and feature
              updates. Join a community of developers dedicated to streamlining
              their documentation process and improving their coding journey.
              Elevate your coding experience with us!
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-row items-center gap-4 w-full max-w-md pb-20"
          >
            <div className="relative align-middle">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </div>
              <input
                type="email"
                value={email} // Add this line to bind the input value to the email state
                onChange={(e) => setEmail(e.target.value)} // Add this line to handle changes in the input value
                className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
              />
            </div>
            <button
              className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
}
