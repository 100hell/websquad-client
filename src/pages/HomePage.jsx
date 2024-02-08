import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";
import { useShowToast } from "../hooks/useShowToast";
import SinglePost from "../components/SinglePost";
import { PostSkelaton } from "../components/PostSkelaton";
import postAtom from "../atom/postAtom";

export const HomePage = () => {
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postAtom);
  const showToast = useShowToast();
  const [currentPosts, setCurrentposts] = useState([]);

  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     let target_position = document
  //       .querySelector("#last_Skalaton")
  //       .getBoundingClientRect().top;
  //     if (target_position <= window.innerHeight) {
  //       loadMorePosts();
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  // }, []);

  useEffect(() => {
    setPosts([]);
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://web-squad-server.vercel.app/api/posts/feed"
        );
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log(data);
        setPosts(data);
        setCurrentposts(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  // const loadMorePosts = () => {
  //   console.log(currentPosts[currentPosts.length - 1]._id);
  // };
  return (
    <>
      {loading && (
        <>
          <PostSkelaton />
          <PostSkelaton />
          <PostSkelaton />
        </>
      )}
      {!loading && posts.length === 0 && (
        <h1 style={{ textAlign: "center" }}>Follow some users to see feed </h1>
      )}
      {posts.map((post) => (
        <SinglePost key={post._id} post={post} userId={post.postedBy} />
      ))}

      {/* <div id="last_Skalaton">
        <PostSkelaton />
      </div> */}
    </>
  );
};
