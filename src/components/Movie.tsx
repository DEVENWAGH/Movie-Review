export default function Movie() {
  // Add error handling for sections
  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1625]">
        <p className="text-xl text-white">No movie data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1625]">
      {sections.map((section, sectionIndex) => (
        <Slider
          key={`${section.title}-${sectionIndex}`}
          title={section.title}
          items={section.items}
        />
      ))}
    </div>
  );
}
