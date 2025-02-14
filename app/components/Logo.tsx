import React from 'react';
import { Link } from 'react-router';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/WatchWiseLogo.svg"
        alt="WatchWise"
        className="h-30 w-auto"
      />
    </Link>
  );
}
