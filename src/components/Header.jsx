import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { LogoutButton } from "./LogoutButton";
import { ChatIcon, Search2Icon } from "@chakra-ui/icons";
import { BsChat, BsGlobe, BsGlobe2 } from "react-icons/bs";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12} alignItems={"center"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} gap={5}>
        {user && (
          <Link to="/">
            <AiFillHome size={24} />
          </Link>
        )}
        {/* <Link to="/explore">
          <BsGlobe size={20} />
        </Link> */}
      </Flex>
      <Image
        cursor={"pointer"}
        alt="logo"
        w={8}
        src={colorMode === "dark" ? "/light-logo.png" : "/dark-logo.png"}
        onClick={toggleColorMode}
      />

      {user && (
        // <Link to={`/${user.username}`}>
        //   <RxAvatar size={24} />
        // </Link>
        <Flex justifyContent={"right"} alignItems={"center"}>
          <Menu>
            <MenuButton
              as={Button}
              bg={"transparent"}
              _hover={{ background: "transparent" }}
            >
              <RxAvatar size={24} />
            </MenuButton>
            <MenuList bg={useColorModeValue("gray.300", "gray.dark")}>
              <MenuGroup title="Profile">
                <MenuItem
                  bg={useColorModeValue("gray.300", "gray.dark")}
                  _hover={{
                    background: useColorModeValue("gray.dark", "gray.300"),
                    color: useColorModeValue("white", "black"),
                  }}
                >
                  <Link to={`/${user.username}`}>My Account</Link>
                </MenuItem>
                <MenuItem
                  bg={useColorModeValue("gray.300", "gray.dark")}
                  _hover={{
                    background: useColorModeValue("gray.dark", "gray.300"),
                    color: useColorModeValue("white", "black"),
                  }}
                >
                  {" "}
                  <LogoutButton />{" "}
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
          <Link to={`/chats`}>
            <BsChat size={22} />
          </Link>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
