import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";

const CourseCard = () => {
  return (
    <Card className="cursor-pointer hover:bg-gray-100/40">
      <Flex gap="4" align="center">
        <Box>
          <Image
            src="https://source.unsplash.com/random/300x200"
            alt="course"
            width={100}
            height={100}
            className="w-16 h-16 object-cover rounded-md"
          />
        </Box>

        <Flex direction="column" justify="between">
          <Heading size="5">Introduction to Computer Science</Heading>
          <Text color="gray" size="3">
            In progress <Text className="inline">25%</Text>
          </Text>

          <Text color="gray" size="3">
            Added on Jan 1, 2023
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CourseCard;
