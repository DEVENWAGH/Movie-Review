import React from "react";
import { Link } from "react-router-dom"; // Updated from "react-router" to "react-router-dom"

export default function Logo() {
  return (
    <Link to="/" className="flex items-center p-2 w-30 ">
      <img src="/action.svg" alt="WatchWise" className="w-auto h-30" />
    </Link>
  );
}
