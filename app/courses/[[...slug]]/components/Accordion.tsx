"use client";
import { Course, Section, File } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface CustomSection extends Section {
  files: File[];
}

interface Props {
  sections: CustomSection[];
  activeResourceSlug: string;
  activeSectionName: string;
  activeSection: Section;
}

const Accordion = ({
  sections,
  activeResourceSlug,
  activeSectionName,
  activeSection,
}: Props) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    activeSection?.id || null
  );
  console.log({ activeSection, activeSectionId });

  const handleSectionClick = (sectionId: string) => {
    setActiveSectionId((prevSection) =>
      prevSection === sectionId ? null : sectionId
    );
  };

  // useEffect(() => {
  //   // console.log("sectionname,", activeSectionName, activeResourceSlug);
  //   const activeSectionId = sections.find((section) =>
  //     section.files.some(
  //       (file) =>
  //         activeSectionName === section.title &&
  //         file.slug === activeResourceSlug
  //     )
  //   );
  //   // console.log({ activeSectionId, activeResourceSlug, sections });
  //   if (activeSection) {
  //     setActiveSectionId(activeSection.id);
  //   }
  // }, [activeResourceSlug]);

  console.log({ activeSectionId });

  return (
    <div className="bg-gray-100 p-4 rounded-md w-[550px]">
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
              activeSectionId === section.id ? "max-h-screen" : "max-h-0"
            }`}
          >
            {section.files.map((file) => (
              <Link
                key={file.id}
                href={`../${section.title}/${file.slug}`}
                className={`p-2 border-b block border-gray-200 ${
                  file.slug == activeResourceSlug &&
                  activeSection.id === section.id
                    ? "bg-red-200"
                    : ""
                }`}
                onClick={() => setActiveSectionId(section.id)}
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
