import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ActionLogo from "../components/ActionLogo";
import Comment from "../components/Comment";
import { useNavigate, useParams } from "react-router-dom";
import { useShowToast } from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import { PostSkelaton } from "../components/PostSkelaton";
import postAtom from "../atom/postAtom";
import { BsSend } from "react-icons/bs";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom);
  const { pid } = useParams();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [reply, setReply] = useState("");
  const [isreplying, setIsReplying] = useState(false);

  const currentPost = posts[0];
  const [postedFile, setPostedFile] = useState(currentPost?.img);

  // console.log("currrent post : ", currentPost?.replies);
  useEffect(() => {
    setPosts([]);
    const getPost = async () => {
      try {
        const res = await fetch(
          `https://web-squad-server.vercel.app/api/posts/${pid}`
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
        // console.log(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPost();
  }, [pid, showToast, setPosts]);

  const handleReplyPost = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast(
        "Error",
        "You must be logged in to Like/Unlike the post",
        "error"
      );
      return;
    }
    setIsReplying(true);
    try {
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/posts/reply/${currentPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ text: reply }),
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setReply("");
      // console.log("data ", data);
      showToast("Success", "Reply sent succesfully", "success");

      const updatedPost = posts.map((p) => {
        if (p._id == currentPost._id) {
          return { ...p, replies: data };
        }
        return p;
      });
      setPosts(updatedPost);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsReplying(false);
    }
  };

  const handleDeletepost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post")) return;
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/posts/${currentPost._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // console.log(data);
      showToast("Success", "Post deleted successfully", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  if (!user && loading) {
    return <PostSkelaton />;
  }

  if (!currentPost) return <PostSkelaton />;
  // console.log(posts);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex alignItems={"center"}>
            <Text size={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={4} align={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
          </Text>
          {currentUser._id === user._id && (
            <DeleteIcon
              size={20}
              onClick={handleDeletepost}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>
      <Text fontSize={"sm"}>{currentPost.text}</Text>

      <Box
        position={"relative"}
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        {/* <Image src={currentPost.img} w={"full"}></Image> */}
        {postedFile?.includes("video") ? (
          <video src={postedFile} controls>
            {" "}
          </video>
        ) : (
          <Image src={postedFile} w={"full"}></Image>
        )}
      </Box>
      <Flex gap={3} my={1}>
        <ActionLogo key={currentPost._id} post={currentPost} postPage={true} />
      </Flex>

      <Divider my={4} />
      {/* <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text size={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like,reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex> */}
      <Flex gap={3}>
        <Input
          placeholder="your reply goes here..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <Button
          colorScheme="blue"
          mr={3}
          size={"sm"}
          onClick={handleReplyPost}
          color={useColorModeValue("black", "white")}
          bg={useColorModeValue("gray.300", "transparent")}
          isLoading={isreplying}
        >
          <BsSend size={"20px"} />
        </Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply, index) => {
        const reverseReply =
          currentPost.replies[currentPost.replies.length - 1 - index];
        return (
          <>
            <Comment
              key={reverseReply._id}
              reply={reverseReply}
              post={currentPost}
            />
          </>
        );
      })}
    </>
  );
};

export default PostPage;
