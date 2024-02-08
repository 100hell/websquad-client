import { Avatar, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postAtom from "../atom/postAtom";
import { useShowToast } from "../hooks/useShowToast";

const Comment = ({ reply, post }) => {
  // console.log(reply._id);
  const [liked, setLiked] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postAtom);
  const [deletingReply, setDeletingReply] = useState(false);
  const showToast = useShowToast();
  const handleDeleteReply = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this comment"))
        return;
      setDeletingReply(true);
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/posts/deleteReply/${post._id}/${reply._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Reply deleted succesfully", "success");
      const updatedPost = posts.map((p) => {
        if (p._id == post._id) {
          return (p = data);
        }
        return p;
      });
      setPosts(updatedPost);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setDeletingReply(false);
    }
  };
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply?.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontWeight={"bold"} fontSize={"sm"}>
              {reply?.username}
            </Text>
            <Flex gap={2} align={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {reply?.createdAt
                  ? `${formatDistanceToNow(new Date(reply?.createdAt))} ago`
                  : " "}
              </Text>
              {currentUser._id === reply.userId && (
                <>
                  {!deletingReply && (
                    <DeleteIcon size="sm" onClick={handleDeleteReply} />
                  )}
                  {deletingReply && <Spinner size={"xs"}></Spinner>}
                </>
              )}
              {/* <BsThreeDots /> */}
            </Flex>
          </Flex>
          <Text>{reply?.text}</Text>
          {/* <ActionLogo liked={liked} setLiked={setLiked} /> */}
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
