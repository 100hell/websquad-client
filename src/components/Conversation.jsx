import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationsAtom } from "../atom/messagesAtom";

export const Conversation = ({ conversation, isOnline }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const colorMode = useColorMode();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationsAtom
  );
  // console.log("selected : ", selectedConversation);
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={1}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: conversation.participants[0]._id,
          userProfilePic: conversation.participants[0].profilePic,
          username: conversation.participants[0].username,
          mock: conversation.mock,
        })
      }
      bg={
        selectedConversation?._id === conversation?._id
          ? colorMode == "light"
            ? "gray.600"
            : "gray.dark"
          : ""
      }
      color={selectedConversation?._id === conversation?._id ? "white" : ""}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={conversation?.participants[0]?.profilePic}
        >
          <AvatarBadge boxSize="1em" bg={isOnline ? "green.500" : "tomato"} />
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {conversation?.participants[0]?.username}
          <Image src="/verified.png" h={"4"} ml={"1"} />
        </Text>
        <Text fontSize={"sm"} display={"flex"} alignItems={"center"} gap={1}>
          {conversation.lastMessage.sender === user._id ? (
            <BsCheck2All size={16} />
          ) : (
            ""
          )}
          {conversation?.lastMessage.text?.length > 15
            ? conversation?.lastMessage.text.substring(0, 15) + "..."
            : conversation.lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};
