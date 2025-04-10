import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="not-found-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
      }}
    >
      <h1>404 - Page Not Found</h1>
      <p>
        The page you're looking for doesn't exist or there was an error fetching
        data.
      </p>
      <Link
        to="/"
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#e50914",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Return to Home Page
      </Link>
    </div>
  );
};

export default NotFound;
