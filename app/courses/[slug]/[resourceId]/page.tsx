import { Flex } from "@radix-ui/themes";
import React from "react";

interface Props {
  params: { resourceId: string };
}

const ResourcePage = ({ params }: Props) => {
  return <Flex mx="5">{params.resourceId}</Flex>;
};

export default ResourcePage;
