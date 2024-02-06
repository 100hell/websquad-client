import { Flex, HStack, Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

export const AccountSkelaton = () => {
  return (
    <>
      <Flex justifyContent={"space-between"}>
        <Stack width={"25%"}>
          <Skeleton height={"20px"} />
          <HStack>
            <Skeleton height={"20px"} w={"50%"} />
            <Skeleton height={"20px"} w={"50%"} />
          </HStack>
        </Stack>

        <Skeleton height={"100px"} width={"100px"} borderRadius={"50%"} />
      </Flex>

      <Skeleton height={"20px"} width={"50%"} />
      <Skeleton width={"20%"} height={"30px"} margin={"20px 0"} />
    </>
  );
};
