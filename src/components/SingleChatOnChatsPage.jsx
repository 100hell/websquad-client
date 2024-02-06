import { Avatar, Container, Divider, Flex, background } from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atom/userAtom";

export const SingleChatOnChatsPage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  return (
    <>
      <Flex padding={"10px "} _hover={{ background: "#282626" }}>
        <Avatar src={user.profilePic}></Avatar>
        <Flex flexDirection={"column"} padding={"0 20px"}>
          <Container color={"white"} padding={"0"}>
            {user.name}
          </Container>
          <p style={{ color: "#ffffff7a" }}>Last message</p>
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};
