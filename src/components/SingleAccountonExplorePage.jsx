import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useShowToast } from "../hooks/useShowToast";

export const SingleAccountonExplorePage = ({ exploreUser }) => {
  const user = useRecoilValue(userAtom);
  const Follows = exploreUser.followers.includes(user._id);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [followUserLoading, setFollowUserLoading] = useState(false);
  const [following, setFollowing] = useState(
    exploreUser.followers.includes(user?._id)
  );

  const handlefollowUser = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        showToast("Error", "Please login first", "error");
        return;
      }
      setFollowUserLoading(true);
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/users/follow/${exploreUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (Follows) {
        showToast("Success", `Unfollowed ${exploreUser.name}`, "success");
        exploreUser.followers.pop();
      } else {
        showToast("Success", `Followed ${exploreUser.name}`, "success");
        exploreUser.followers.push(user._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
      console.log(error);
    } finally {
      setFollowUserLoading(false);
    }
  };

  return (
    <>
      {/* {!Follows && ( */}
      <Flex
        flexDirection={"column"}
        _hover={{ bg: useColorModeValue("#ffffff52", "#383838") }}
        cursor={"pointer"}
        padding={"0 20px"}
      >
        <Flex alignItems={"center"}>
          <Flex
            justifyContent={"space-between"}
            w={"100%"}
            alignItems={"center"}
            gap={3}
          >
            <Flex alignItems={"center"} gap={3} my={2}>
              <Avatar
                size={"md"}
                name={exploreUser?.name}
                src={exploreUser.profilePic}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${exploreUser.username}`);
                }}
              />
              <Flex>{exploreUser.username}</Flex>
            </Flex>
            <Flex>
              <Button
                onClick={(event) => handlefollowUser(event)}
                isLoading={followUserLoading}
              >
                {Follows ? "unfollow " : "follow"}
              </Button>
              {/* {Follows && <p> following</p>} */}
            </Flex>
          </Flex>
        </Flex>
        <Divider />
      </Flex>
      {/* )} */}
    </>
  );
};
