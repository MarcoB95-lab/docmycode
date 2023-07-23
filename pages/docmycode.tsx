import { getSession, signOut } from "next-auth/react";
import { NextPageContext } from "next";
import { Session } from "next-auth";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useState, useEffect, useRef } from "react";
import { IoCopyOutline } from "react-icons/io5";
import hljs from "highlight.js";
import "highlight.js/styles/nord.css";
import Navbar from "@/components/navbar/Navbar";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Footer from "@/components/Footer";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

interface Message {
  type: string;
  text: string;
}
interface HomeProps {
  session: Session;
}

export default function Home({ session }: HomeProps) {
  const { data: user } = useCurrentUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inlineComments, setInlineComments] = useState(false);
  const [explain, setExplain] = useState(false);
  const [docStrings, setDocStrings] = useState(false);
  const [codeBlockComments, setCodeBlockComments] = useState(false);
  const [apiDocumentation, setApiDocumentation] = useState(false);
  const [optimize, setOptimize] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef(null);
  const lineHeight = 1.2;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(
      () => {
        console.log("Code copied to clipboard.");
      },
      (err) => {
        console.error("Could not copy code to clipboard:", err);
      }
    );
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const minHeight =
        3 *
        parseFloat(getComputedStyle(textareaRef.current).fontSize) *
        lineHeight;
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        minHeight
      )}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);
    }
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([...messages, { type: "user", text: inputValue }]);

    // Toast notification to say Loading.
    toast.info("DocMyCode is thinking...", { theme: "dark" }); // Toast notification for "Loading"
    try {
      const response = await fetch("/api/generateResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputValue,
          explain,
          optimize,
          inlineComments,
          docStrings,
          codeBlockComments,
          apiDocumentation,
        }),
      });
      const data = await response.json();
      // Toast notification to say sucessful.
      toast.success("Successful!", { theme: "dark" });

      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: data.message },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
    setInputValue("");
  };

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
      <div className="flex flex-col h-screen bg-gradient-to-br from-start-gradient to-end-gradient overflow-hidden">
        <Navbar session={session} />
        <div className="lex-1 mt-5"></div>
        {/* Chat */}
        <div
          ref={messagesContainerRef}
          className="p-4 rounded-lg mb-4 h-96 overflow-y-auto flex-grow mx-auto"
          style={{
            width: "100vw",
            height: "80vh",
            marginTop: "5rem",
          }}
        >
          <div className="text-2xl font-bold text-gray-800 mb-4 mx-auto text-center">
            We apologize for any inconvenience caused by the current 400-word
            limit for code documentation. Our team is actively working to
            improve the platform and introduce new features that will enhance
            your user experience. We appreciate your patience and encourage you
            to stay tuned for upcoming updates and improvements. Additionally,
            please note that we have a daily request limit of 10 at this time.{" "}
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded relative ${
                message.type === "ai" ? "bg-gray-400" : "bg-gray-300"
              }`}
              style={{ backgroundColor: "inherit", margin: 0 }}
            >
              <div className="text-2sm font-bold text-gray-800 mb-1">
                {message.type === "user"
                  ? session?.user?.name
                    ? session.user.name
                    : "Unknown"
                  : "DocMyCode"}
              </div>
              <pre>
                <div className="relative">
                  <code
                    ref={codeRef}
                    className={`whitespace-pre-wrap ${
                      message.type === "ai" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {message.text}
                  </code>
                  <button
                    className={`absolute top-2 right-2 ${
                      message.type === "ai" ? "text-gray-400" : "text-gray-400"
                    }`}
                    onClick={() => handleCopyCode(message.text)}
                    title="Copy code"
                  >
                    <div className="flex flex-row items-center">
                      <IoCopyOutline size={20} />
                      <span className="ml-1 pl-2">Copy code</span>
                    </div>
                  </button>
                </div>
              </pre>
            </div>
          ))}
        </div>
        {/* ChatInput */}
        <div className="rounded-lg text-xl text-black border-t border-white pt-2 flex flex-col items-center">
          <div className="flex text-black gap-2">
            <label className="inline-flex items-center mr-4">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className={`${
                  explain ? "text-black" : "text-white"
                } cursor-pointer`}
                onClick={() => {
                  setExplain(!explain);
                  setInlineComments(false);
                  setDocStrings(false);
                  setCodeBlockComments(false);
                  setApiDocumentation(false);
                  setOptimize(false);
                }}
              />
              <span className="ml-2">Explain</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className={`${
                  optimize ? "text-black" : "text-white"
                } cursor-pointer`}
                onClick={() => {
                  setExplain(false);
                  setInlineComments(false);
                  setDocStrings(false);
                  setCodeBlockComments(false);
                  setApiDocumentation(false);
                  setOptimize(!optimize);
                }}
              />
              <span className="ml-2">Optimize</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className={`${
                  inlineComments ? "text-black" : "text-white"
                } cursor-pointer`}
                onClick={() => {
                  setExplain(false);
                  setInlineComments(!inlineComments);
                  setDocStrings(false);
                  setCodeBlockComments(false);
                  setApiDocumentation(false);
                  setOptimize(false);
                }}
              />
              <span className="ml-2">Inline Comments</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className={`${
                  codeBlockComments ? "text-black" : "text-white"
                } cursor-pointer`}
                onClick={() => {
                  setExplain(false);
                  setInlineComments(false);
                  setDocStrings(false);
                  setCodeBlockComments(!codeBlockComments);
                  setApiDocumentation(false);
                  setOptimize(false);
                }}
              />
              <span className="ml-2">Code Block Comments</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className={`${
                  docStrings ? "text-black" : "text-white"
                } cursor-pointer`}
                onClick={() => {
                  setExplain(false);
                  setInlineComments(false);
                  setDocStrings(!docStrings);
                  setCodeBlockComments(false);
                  setApiDocumentation(false);
                  setOptimize(false);
                }}
              />
              <span className="ml-2">DocStrings</span>
            </label>
            <label className="inline-flex items-center">
              <FontAwesomeIcon
                icon={faSquareCheck}
                className={`${
                  apiDocumentation ? "text-black" : "text-white"
                } cursor-pointer`}
                onClick={() => {
                  setExplain(false);
                  setInlineComments(false);
                  setDocStrings(false);
                  setCodeBlockComments(false);
                  setApiDocumentation(!apiDocumentation);
                  setOptimize(false);
                }}
              />
              <span className="ml-2">API Documentation</span>
            </label>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-5 flex items-center justify-between w-1/2 text-center mx-auto"
          >
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-transparent border border-black text-black rounded-lg  flex-grow pl-4 pr-10 resize-none"
              placeholder="Paste your code in here..."
              style={{ minHeight: "1rem", maxHeight: "9rem" }} // set a minimum and maximum height
            ></textarea>
            <button
              type="submit"
              disabled={!inputValue}
              className="ml-3 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-6 w-6 -rotate-45 text-black" />
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
