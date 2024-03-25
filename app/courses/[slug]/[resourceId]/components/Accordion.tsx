"use client";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  sections: Section[];
}

const Accordion = ({ sections }: Props) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection((prevSection) =>
      prevSection === sectionId ? null : sectionId
    );
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      {sections.map((section) => (
        <div className="mb-2" key={section.id}>
          <div
            className="flex items-center justify-between p-2 bg-white rounded-md cursor-pointer"
            onClick={() => handleSectionClick(section.id)}
          >
            {section.title}
            {/* Add an icon for expand/collapse if desired */}
          </div>
          <div
            className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
              activeSection === section.id ? "max-h-screen" : "max-h-0"
            }`}
          >
            {section.files.map((file) => (
              <Link
                key={file.id}
                href={`./${file.slug}`}
                className={`p-2 border-b block border-gray-200 ${
                  file.currentlyPlaying ? "bg-gray-200" : ""
                }`}
              >
                {file.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
