import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import { MessageInput } from "./MessageInput";
import { useShowToast } from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationsAtom,
} from "../atom/messagesAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import { useSocket } from "../../context/SocketContext";

const MessageContainer = () => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationsAtom
  );
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMassages] = useState([]);
  const showToast = useShowToast();
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      // console.log(message);
      if (selectedConversation._id === message.conversationId) {
        setMassages((prevMessage) => [message, ...prevMessage]);
      }
      setConversations((prev) => {
        console.log("prev: ", prev);
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
    return () => socket.off("newMessage");
  }, [socket]);
  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMassages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(
          `https://web-squad-server.vercel.app/api/messages/${selectedConversation.userId}`
        );
        const data = await res.json();
        setMassages(data);
      } catch (error) {
        showToast("error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  // console.log("messages: ", messages);
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
    >
      {/* Message header */}
      <Flex flex={"full"} h={12} alignItems={"center"} gap={2} p={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.png" h={"4"} ml={"1"} />
        </Text>
      </Flex>
      <Divider />
      <Flex
        flexDirection={"column-reverse"}
        gap={4}
        my={4}
        p={2}
        height={"400px"}
        overflowY={"Auto"}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8px"} width={"250px"} />
                <Skeleton h={"8px"} width={"250px"} />
                <Skeleton h={"8px"} width={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadingMessages &&
          messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              ownmessage={currentUser._id === message.sender}
            />
          ))}
      </Flex>
      <MessageInput setMassages={setMassages} />
    </Flex>
  );
};

export default MessageContainer;
