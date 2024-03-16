import { Course } from "@prisma/client";
import { Flex, Heading } from "@radix-ui/themes";
import React from "react";
import CourseCard from "./components/CourseCard";

interface Props {
  courses: Course[];
}

const RecentlyAddedCourses = ({ courses }: Props) => {
  return (
    <Flex direction="column" gap="3">
      <Heading>Recently added courses</Heading>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </Flex>
  );
};

export default RecentlyAddedCourses;
