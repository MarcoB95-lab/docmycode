import { FaTwitter } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  return (
    <footer className="bg-transparent fixed bottom-0 left-0 right-0 py-4 flex justify-between items-center px-5">
      <div className="text-black text-sm">
        © {currentYear} DocMyCode
      </div>
      <a
        href="https://twitter.com/DocmyCode"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-gray-700 transition-colors duration-300"
      >
        <FaTwitter size={24} />
      </a>
    </footer>
  );
};

export default Footer;
