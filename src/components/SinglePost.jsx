import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ActionLogo from "./ActionLogo";
import { useShowToast } from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import postAtom from "../atom/postAtom";

const SinglePost = ({ post, userId }) => {
  const [postedByUser, setPostedByUser] = useState(null);
  const [postedFile, setPostedFile] = useState(post.img);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postAtom);
  const currentUser = useRecoilValue(userAtom);
  useEffect(() => {
    const getUserById = async () => {
      try {
        const res = await fetch(
          `https://web-squad-server.vercel.app/api/users/profile/${userId}`
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log(data);
        setPostedByUser(data);
      } catch (error) {
        showToast("Error", error, "error");
        setPostedByUser(null);
      }
    };
    getUserById();
  }, [userId]);

  if (!postedByUser) return null;

  const handleDeletepost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post")) return;
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/posts/${post._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted successfully", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  return (
    <Link to={`/${postedByUser.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={"md"}
            name={postedByUser?.name}
            src={postedByUser.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postedByUser.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box w={"full"} position={"relative"}>
            {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
            {post.replies[0] && (
              <Avatar
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
                size={"xs"}
                name="john doe"
                src={post.replies[0].userProfilePic}
              />
            )}
            {post.replies[1] && (
              <Avatar
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
                size={"xs"}
                name="Christian Nwamba"
                src={post.replies[1].userProfilePic}
              />
            )}
            {post.replies[2] && (
              <Avatar
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
                size={"xs"}
                name="Prosper Otemuyiwa"
                src={post.replies[2].userProfilePic}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} width={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedByUser.username}`);
                }}
              >
                {postedByUser?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                color={"gray.light"}
                textAlign={"right"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === postedByUser._id && (
                <DeleteIcon size={20} onClick={handleDeletepost} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              position={"relative"}
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              {postedFile.includes("video") ? (
                <video src={postedFile} controls>
                  {" "}
                </video>
              ) : (
                <Image src={post.img} w={"full"}></Image>
              )}
            </Box>
          )}

          <Flex gap={3} my={1}>
            <ActionLogo key={post._id} post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default SinglePost;
