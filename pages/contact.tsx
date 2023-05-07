import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";

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

export default function Contact({ session }: HomeProps) {
  const [charCount, setCharCount] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleCharCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, message }),
    });

    if (response.ok) {
      alert("Email sent successfully!");
      setEmail("");
      setName("");
      setMessage("");
      setCharCount(0);
    } else {
      alert("Error sending email.");
    }
  };

  return (
    <>
      <Head>
        <title>DocMyCode</title>
        <meta
          name="description"
          content="Easily create, manage, and share code documentation in one place. DocMyCode lets you explain your code and keep your documentation up-to-date."
        />
        <meta
          property="og:title"
          content="DocMyCode - Code Documentation Made Easy"
        />
        <meta
          property="og:description"
          content="Easily create, manage, and share code documentation in one place. DocMyCode lets you explain your code and keep your documentation up-to-date."
        />
      </Head>
      <Navbar session={session} />
      <div className="min-h-screen bg-gradient-to-br from-start-gradient to-end-gradient flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <div className="w-11/12 md:w-2/5">
          <p className="text-xl text-center mb-8">
            If you have any questions, feature requests or concerns, please fill
            out the form below and we will get back to you as soon as possible.
          </p>
        </div>
        <form
          className="flex flex-col items-center gap-4 w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="email"
            className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-300"
          >
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="name@flowbite.com"
            required
          />
          <label
            htmlFor="username"
            className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="text"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="Name"
            required
          />
          <label
            htmlFor="message"
            className="block mb-2 text-xl font-medium text-gray-900 dark:text-gray-400"
          >
            Your message
          </label>
          <div className="relative w-full">
            <textarea
              id="message"
              rows="6"
              maxLength={1000}
              className="block p-2.5 w-full text-2xl text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Leave a comment..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleCharCount(e);
              }}
            />
            <div className="absolute bottom-2 right-2">
              <span className="text-sm">{charCount}/1000</span>
            </div>
          </div>
          <button
            className="hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
