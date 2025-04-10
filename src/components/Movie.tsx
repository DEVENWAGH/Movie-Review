import React from "react";
import SimpleSlider from "./SimpleSlider";

interface MovieSection {
  title: string;
  items: any[];
}

interface MovieProps {
  sections: MovieSection[];
}

export default function Movie({ sections }: Readonly<MovieProps>) {
  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {sections.map((section, sectionIndex) => (
        <SimpleSlider key={`section-${sectionIndex}`} items={section.items} />
      ))}
    </div>
  );
}
