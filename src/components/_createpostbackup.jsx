import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Container,
  Flex,
  FormControl,
  Image,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { usePreviewImg } from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useShowToast } from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";

export const CreatePost = () => {
  const MAX_CHAR = 500;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const user = useRecoilValue(userAtom);
  const { handleImageChange, imgurl, setImgUrl } = usePreviewImg();
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [maxTextyped, setmaxTextTyped] = useState(false);
  const [posts, setPosts] = useRecoilState(postAtom);
  const showToast = useShowToast();
  const handlePostTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setmaxTextTyped(true);
      const TruncateText = inputText.slice(0, MAX_CHAR);
      setPostText(TruncateText);
      setRemainingChar(0);
    } else {
      setmaxTextTyped(false);
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const handleCreatePost = async () => {
    try {
      setIsPosting(true);
      const res = await fetch(
        "https://web-squad-server.vercel.app/api/posts/create",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            postedBy: user._id,
            text: postText,
            img: imgurl,
          }),
        }
      );

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log("post data: ", data);
      showToast("Success", "Post Created Successfully", "success");
      setPosts([data, ...posts]);
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsPosting(false);
    }
  };
  const imageRef = useRef(null);
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("gray.300", "gray.dark")}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} bg={useColorModeValue("gray.300", "gray.dark")}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                onChange={handlePostTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                textAlign={"right"}
                fontWeight={"bold"}
                m={"1"}
                color={useColorModeValue("gray.800", "white")}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              {maxTextyped && (
                <Text color={"white"} fontSize={"xs"} mb={2}>
                  You have exceeded the max limit of {MAX_CHAR} characters.
                </Text>
              )}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {imgurl && (
              <Flex mt={5} position={"relative"} w={"full"}>
                <Image src={imgurl} alt="Selecte image" />
                <CloseButton
                  onClick={() => setImgUrl("")}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={isPosting}
              size={"sm"}
              bg={useColorModeValue("gray.300", "lightblue")}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
