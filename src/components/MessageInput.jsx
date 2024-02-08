import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsEmojiSunglasses, BsSend } from "react-icons/bs";
import { useShowToast } from "../hooks/useShowToast";
import EmojiPicker from "emoji-picker-react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationsAtom,
} from "../atom/messagesAtom";
import { GiCancel } from "react-icons/gi";
export const MessageInput = ({ setMassages }) => {
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [emogiOpen, setEmogiOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationsAtom
  );
  const setConversations = useSetRecoilState(conversationsAtom);
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;
    // console.log(messageText);
    try {
      const res = await fetch(
        "https://web-squad-server.vercel.app/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            recipientId: selectedConversation.userId,
          }),
        }
      );
      const data = await res.json();
      // console.log("msg data: ", data);
      if (data.error) {
        showToast("error", error.message, "error");
      }
      setMassages((messages) => [data, ...messages]);
      setConversations((prevCons) => {
        const updatedConversations = prevCons.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
    } catch (error) {
      showToast("error", error.message, "error");
    }
  };
  return (
    <Flex position={"relative"}>
      <form onSubmit={handleSendMessage} style={{ flex: "1" }}>
        {emogiOpen && (
          <Flex position={"absolute"} bottom={"110%"} left={"0"}>
            <GiCancel
              size={20}
              style={{
                position: "absolute",
                top: "0",
                color: "black",
                right: "0",
                zIndex: "10",
              }}
              onClick={() => setEmogiOpen(false)}
            />
            <EmojiPicker
              size={15}
              width={"300px"}
              height={"350px"}
              onEmojiClick={(e) => {
                setMessageText((messageText) => messageText + e.emoji);
                width;
              }}
            />
          </Flex>
        )}
        <InputGroup>
          <InputLeftElement onClick={() => setEmogiOpen(!emogiOpen)}>
            <BsEmojiSunglasses size={20} />
          </InputLeftElement>
          <Input
            w={"full"}
            placeholder="write message here"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement cursor={"pointer"} onClick={handleSendMessage}>
            <BsSend size={20} />
          </InputRightElement>
        </InputGroup>
      </form>
      {/* <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          w={"400px"}
          maxW={"350px"}
          bg={useColorModeValue("gray.300", "gray.dark")}
          margin={"0 auto"}
        >
          <DrawerBody padding={"0px"} isOpen={isOpen}>
            <EmojiPicker
              width={"400px"}
              height={"400px"}
              onEmojiClick={(e) => {
                setMessageText((messageText) => messageText + e.emoji);
                width;
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
    </Flex>
  );
};
