import { Avatar, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationsAtom } from "../atom/messagesAtom";
import userAtom from "../atom/userAtom";
import { Tooltip } from "@chakra-ui/react";
export const Message = ({ message, ownmessage }) => {
  var date = new Date(message.createdAt);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  var formattedDate = year + "-" + month + "-" + day;
  var formattedTime = hours + ":" + minutes + ":" + seconds;

  console.log("Date:", formattedDate);
  console.log("Time:", formattedTime);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationsAtom
  );
  const user = useRecoilValue(userAtom);
  // console.log("final", message);
  return (
    <>
      <Tooltip
        label={`date: ${formattedDate
          .split("-")
          .reverse()
          .toString()
          .replaceAll(",", "-")}, time: ${formattedTime}`}
        fontSize="xs"
        hasArrow
        arrowSize={10}
      >
        {ownmessage ? (
          <Flex gap={2} alignSelf={"flex-end"} cursor={"pointer"}>
            <Text maxW={"350px"} bg={"blue.400"} borderRadius={"md"} p={2}>
              {message.text}
            </Text>
            <Avatar src={user.profilePic} w={7} h={7} />
          </Flex>
        ) : (
          <Flex gap={2} alignSelf={"flex-start"} cursor={"pointer"}>
            <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
            <Text
              maxW={"350px"}
              bg={"gray.400"}
              color={"black"}
              borderRadius={"md"}
              p={2}
            >
              {message.text}
            </Text>
          </Flex>
        )}
      </Tooltip>
    </>
  );
};
