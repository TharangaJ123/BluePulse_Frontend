import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-10 w-full bottom-0 left-0">
      <div className="flex flex-col md:flex-row justify-between items-center px-10 w-full">
        <p className="text-sm">&copy; {new Date().getFullYear()} BluePulse. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/FeedbackForm" className="hover:text-blue-400 transition-all">FeedBacks</Link>
          <a href="#" className="hover:text-blue-400 transition-all">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition-all">Contact</a>
        </div>
      </div>
    </footer>
  );
}
