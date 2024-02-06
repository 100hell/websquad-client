import React from "react";
import SignupCard from "../components/SignUpCard";
import LogInCard from "../components/Login";
import { useRecoilValue } from "recoil";
import authScreenAtom from "../atom/authAtom";

export const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <LogInCard /> : <SignupCard />}</>;
};
