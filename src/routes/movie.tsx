import React from "react";
import Discover from "../components/Discover"; // Fixed path from "../app/components/Discover"
import Layout from "../components/shared/Layout"; // Fixed path

export default function Movie() {
  return (
    <Layout>
      <div className="bg-black rounded-xl p-6">
        <Discover mediaType="movie" title="Discover Movies" />
      </div>
    </Layout>
  );
}
