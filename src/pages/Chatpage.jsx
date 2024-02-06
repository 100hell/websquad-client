import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useShowToast } from "../hooks/useShowToast";
import userAtom from "../atom/userAtom";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Conversation } from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import {
  conversationsAtom,
  selectedConversationsAtom,
} from "../atom/messagesAtom";
import { GiConversation } from "react-icons/gi";
import { useSocket } from "../../context/SocketContext";
export const Chatpage = () => {
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversation, setConversation] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationsAtom
  );
  const [searchingUser, setSearchingUser] = useState(false);
  const [searchText, setSearchText] = useState("");
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("error", data.error, "error");
          return;
        }
        // console.log(data);
        setConversation(data);
      } catch (error) {
        showToast("error", error.message, "error");
      } finally {
        setLoadingConversation(false);
      }
    };

    getConversations();
  }, [showToast, setConversation]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("error", searchedUser.error, "error");
        return;
      }
      // console.log(searchedUser);
      // condition to check if the user is searching for himself.
      if (searchedUser._id === currentUser._id) {
        showToast("error", "You can't message yourself", "error");
      }

      // if conversation exist it will open the chat with the searched user.
      const conversationAlreadyExist = conversation.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );
      if (conversationAlreadyExist) {
        setSelectedConversation({
          _id: conversationAlreadyExist._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversation((prevCons) => [...prevCons, mockConversation]);
    } catch (error) {
      showToast("error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{ base: "100%", md: "80%", lg: " 750px" }}
      padding={4}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{ sm: "400px", md: "full" }}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConversation &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                alignItems={"center"}
                p={1}
                gap={4}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversation &&
            conversation.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>
              {" "}
              Select a conversation to start messaging.
            </Text>
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};
