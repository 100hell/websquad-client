import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { useShowToast } from "../hooks/useShowToast";
import { Divider, Flex } from "@chakra-ui/react";
import { SingleAccountSkelaton } from "../components/SingleAccountSkelaton";
import { SingleAccountonExplorePage } from "../components/SingleAccountonExplorePage";
import ExploreSearchBox from "../components/ExploreSearchBox";

export const ExplorePage = () => {
  const user = useRecoilValue(userAtom);
  const [exploreUsers, setExploreusers] = useState([]);
  const [loadingExploreUsers, setLoadingExploreusers] = useState(false);
  const showToast = useShowToast();
  useEffect(() => {
    const getUser = async () => {
      setLoadingExploreusers(true);
      setExploreusers([]);
      const res = await fetch("/api/users/explore");
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      //   console.log(data);
      setExploreusers(data);
      setLoadingExploreusers(false);
    };
    getUser();
  }, [setExploreusers]);
  return (
    <>
      {loadingExploreUsers && (
        <Flex flexDir={"column"} gap={2}>
          <SingleAccountSkelaton />
          <SingleAccountSkelaton />
          <SingleAccountSkelaton />
          <SingleAccountSkelaton />
        </Flex>
      )}
      {!loadingExploreUsers && (
        <>
          <Flex fontSize={"1.2rem"}>Explore People around you</Flex>
          <Divider my={2} />
          {exploreUsers.map((users) => {
            const Follows = users.followers.includes(user._id);

            // console.log(Follows, "fgfsgsg=====", users.name);
            return (
              <div key={users._id}>
                {!Follows && user._id !== users._id && (
                  <SingleAccountonExplorePage exploreUser={users} />
                )}
              </div>
            );
          })}
          <ExploreSearchBox />
        </>
      )}
    </>
  );
};
