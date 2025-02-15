// ...existing imports...

export default function Movie() {
  // ...existing code...

  return (
    <div className="min-h-screen bg-[#0A1625]">
      {/* ...existing divs... */}
      {sections.map((section, sectionIndex) => (
        <Slider
          key={`${section.title}-${sectionIndex}`}
          title={section.title}
          items={section.items}
        />
      ))}
      {/* ...existing divs... */}
    </div>
  );
}
