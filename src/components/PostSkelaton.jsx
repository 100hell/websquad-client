import { Container, HStack, Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

export const PostSkelaton = () => {
  return (
    <>
      <Container mb={"40px"}>
        <HStack marginBottom={"10px"}>
          <Skeleton
            width={"40px"}
            height={"40px"}
            borderRadius={"50%"}
          ></Skeleton>
          <Skeleton width={"50%"} height={"20px"}></Skeleton>
        </HStack>
        <Stack>
          <Skeleton height="300px" margin={"20px 0 "} />
        </Stack>
        <HStack margin={"10px 0"}>
          <Skeleton width={"20px"} height={"20px"}></Skeleton>
          <Skeleton width={"20px"} height={"20px"}></Skeleton>
          <Skeleton width={"20px"} height={"20px"}></Skeleton>
        </HStack>
        {/* <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack> */}
      </Container>
    </>
  );
};
