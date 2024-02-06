import { Avatar, Divider, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserFollower = ({ user, CloseDrawer }) => {
  const navigate = useNavigate();
  return (
    <Flex
      flexDirection={"column"}
      _hover={{ bg: useColorModeValue("#ffffff52", "#383838") }}
      cursor={"pointer"}
      padding={"0 20px"}
      onClick={(e) => {
        e.preventDefault();
        navigate(`/${user.username}`);
        CloseDrawer();
      }}
    >
      <Flex alignItems={"center"}>
        <Flex
          justifyContent={"space-between"}
          w={"100%"}
          alignItems={"center"}
          gap={3}
        >
          <Flex alignItems={"center"} gap={3} my={2}>
            <Avatar size={"md"} name={user?.name} src={user.profilePic} />
            <Flex>{user.username}</Flex>
          </Flex>
          <Flex>{user.followers.length} Followers</Flex>
        </Flex>
      </Flex>
      <Divider />
    </Flex>
  );
};

export default UserFollower;
