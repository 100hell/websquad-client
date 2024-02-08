import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Container,
  Flex,
  FormControl,
  Image,
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
import { useShowToast } from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";
import { BsFillImageFill } from "react-icons/bs";

export const CreatePost = () => {
  const MAX_CHAR = 500;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const user = useRecoilValue(userAtom);
  const { fileUrl, setFileUrl } = usePreviewImg(); // Changed function name and variable name
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [maxTextTyped, setMaxTextTyped] = useState(false);
  const [posts, setPosts] = useRecoilState(postAtom);
  const showToast = useShowToast();

  const handleFileChange = async () => {
    function getBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        console.log(reader.result);
        setUploadedFile(reader.result);
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
    getBase64(fileRef.current.files[0]);
    console.log(uploadedFile);
  };
  const handlePostTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setMaxTextTyped(true);
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setMaxTextTyped(false);
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const fileRef = useRef(null); // Changed variable name
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
            img: uploadedFile,
          }),
        }
      );
      const data = await res.json();
      if (data.error) {
        console.log(data.error);
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post Created Successfully", "success");
      setPosts([data, ...posts]);
      onClose();
      setPostText("");
      setUploadedFile(""); // Changed function name
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsPosting(false);
    }
  };
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
              {maxTextTyped && (
                <Text color={"white"} fontSize={"xs"} mb={2}>
                  You have exceeded the max limit of {MAX_CHAR} characters.
                </Text>
              )}
              <Input
                type="file"
                hidden
                ref={fileRef} // Changed reference
                accept="image/*, video/*" // Allowing both images and videos
                onChange={handleFileChange} // Changed function name
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => fileRef.current.click()}
              />
            </FormControl>
            {uploadedFile && ( // Changed variable name
              <Flex mt={5} position={"relative"} w={"full"}>
                {uploadedFile.includes("video/") ? ( // Checking if it's a video
                  <video src={uploadedFile} controls />
                ) : (
                  <Image src={uploadedFile} alt="Selected media" />
                )}
                <CloseButton
                  onClick={() => setUploadedFile("")} // Changed function name
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
