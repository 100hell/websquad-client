import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import { useShowToast } from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import SinglePost from "../components/SinglePost";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { AccountSkelaton } from "../components/AccountSkelaton";
import { PostSkelaton } from "../components/PostSkelaton";
import { useRecoilState } from "recoil";
import postAtom from "../atom/postAtom";

const UserPage = () => {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    setPosts([]);
    const getPost = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        // console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPost();
  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return <AccountSkelaton />;
  }
  if (!user && !loading) {
    return <h1 style={{ textAlign: "center" }}>User not found!</h1>;
  }
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && (
        <h1 style={{ textAlign: "center", marginTop: "20px" }}>
          No posts available for this user.
        </h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} mt={12}>
          <PostSkelaton />
        </Flex>
      )}
      {posts.map((post) => (
        <SinglePost key={post?._id} post={post} userId={user._id} />
      ))}
    </>
  );
};

export default UserPage;
