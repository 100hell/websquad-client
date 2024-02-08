import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Img,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { useShowToast } from "../hooks/useShowToast";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import UserFollower from "./UserFollower";
const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const [userFollowers, setUserFollowers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAvatarOpen,
    onOpen: onAvatarOpen,
    onClose: onAvatarClose,
  } = useDisclosure();

  const copyURL = () => {
    const currentURl = window.location.href;
    navigator.clipboard.writeText(currentURl);
    toast({
      description: "Profile link copied.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Follow unfollow user
  const handleFollowUser = async () => {
    try {
      if (!currentUser) {
        showToast("Error", "Please login first", "error");
        return;
      }
      setUpdating(true);
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/users/follow/${user._id}`,
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

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", Error, "error");
    } finally {
      setUpdating(false);
    }
  };

  const showUserFollowersList = () => {
    onOpen();
    setUserFollowers([]);
    const getUserFollowers = async (follower) => {
      try {
        const res = await fetch(
          `https://web-squad-server.vercel.app/api/users/profile/${follower}`
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUserFollowers((userFollowers) => [...userFollowers, data]);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    user.followers.map((follower) => {
      getUserFollowers(follower);
    });
  };
  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justify={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"start"} flexDirection={"column"}>
            <Text fontSize={"sm"} fontWeight={"bold"} mb={2}>
              @{user.username}{" "}
            </Text>
            <Text fontSize={15} color={useColorModeValue("black", "darkgray")}>
              {user.bio}
            </Text>
          </Flex>
        </Box>
        <Box onClick={onAvatarOpen}>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base: "md",
              md: "xl",
            }}
          />
        </Box>
        <Modal onClose={onAvatarClose} isOpen={isAvatarOpen} isCentered>
          <ModalOverlay />
          <ModalContent bg={useColorModeValue("gray.300", "gray.dark")}>
            <ModalHeader textAlign={"center"}>
              {user.username}'s Profile Picture
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Img src={user.profilePic} width={"100%"} />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>

      {currentUser._id === user._id ? (
        <RouterLink to="/update">
          <Button size={"sm"}>Edit Profile</Button>
        </RouterLink>
      ) : (
        <RouterLink>
          <Button size={"sm"} onClick={handleFollowUser} isLoading={updating}>
            {following ? "Unfollow" : "Follow"}
          </Button>
        </RouterLink>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text
            color={useColorModeValue("black", "white")}
            onClick={showUserFollowersList}
            cursor={"pointer"}
          >
            {user.followers.length} followers
          </Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>WebSquad.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid grey"}
          color={"gray.light"}
          justifyContent={"center"}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          w={"620px"}
          maxW={"620px"}
          bg={useColorModeValue("gray.300", "gray.dark")}
          margin={"0 auto"}
          minH={"100vh"}
        >
          <DrawerHeader borderBottomWidth="1px">
            <Flex justifyContent={"space-between"} w={"100%"}>
              {" "}
              <span>{user.followers.length} Followers</span>{" "}
              <ChevronUpIcon onClick={onClose} />
            </Flex>{" "}
          </DrawerHeader>
          <DrawerBody padding={"0px"}>
            {userFollowers &&
              userFollowers.map((follower) => {
                return (
                  <UserFollower
                    key={follower._id}
                    user={follower}
                    CloseDrawer={onClose}
                  />
                );
              })}
            {userFollowers.length === 0 && (
              <Flex textAlign={"center"} justifyContent={"center"} py={3}>
                No Followers Found
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </VStack>
  );
};

export default UserHeader;
