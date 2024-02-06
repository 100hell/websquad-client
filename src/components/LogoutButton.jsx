import { Button, Flex, background } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import { FiLogOut } from "react-icons/fi";
import { useShowToast } from "../hooks/useShowToast";
import { Navigate } from "react-router-dom";

export const LogoutButton = () => {
  const setuser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      }
      localStorage.removeItem("user-websquad");
      setuser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <Flex
      // position={"fixed"}
      // top={"30px"}
      // right={"30px"}
      bg={"transparent"}
      _hover={{ background: "transparent" }}
      size={"xm"}
      textAlign={"start"}
      fontWeight={"normal"}
      onClick={handleLogout}
    >
      Log out
    </Flex>
  );
};
