"use client";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import { usePreviewImg } from "../hooks/usePreviewImg";
import { useShowToast } from "../hooks/useShowToast";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function UpdateUserPage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const fileRef = useRef(null);
  const showToast = useShowToast();
  const { handleImageChange, imgurl } = usePreviewImg();
  const navigate = useNavigate();

  const handleUpdateFromSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await fetch(
        `https://web-squad-server.vercel.app/api/users/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...inputs, profilePic: imgurl }),
        }
      );
      const data = await res.json();
      // console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile Updated", "success");
      setUser(data);
      localStorage.setItem("user-websquad", JSON.stringify(data));
      navigate(`/${data.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    }
    setUpdateLoading(false);
  };

  return (
    <form onSubmit={handleUpdateFromSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgurl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="Your full name"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>{" "}
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="your username"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="your bio"
              value={inputs.bio}
              minH={"100px"}
              textAlign={"start"}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          {/* <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="your password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl> */}
          <Stack spacing={6} direction={["column", "row"]}>
            <NavLink to={`/${user.username}`}>
              <Button
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
              >
                Cancel
              </Button>
            </NavLink>

            {updateLoading ? (
              <Button
                isLoading
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "green.500",
                }}
              ></Button>
            ) : (
              <Button
                bg={"green.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "green.500",
                }}
                type="submit"
              >
                Submit
              </Button>
            )}
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
