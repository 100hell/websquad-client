import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atom/userAtom";
import UpdateUserPage from "./pages/UpdateUserPage";
import { CreatePost } from "./components/CreatePost";
import PostPage from "./pages/PostPage";
import { Chatpage } from "./pages/Chatpage";
import { ExplorePage } from "./pages/ExplorePage";

function App() {
  const user = useRecoilValue(userAtom);
  return (
    <Box position={"absolute"} width={"full"}>
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateUserPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={user ? <UserPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username/post/:pid"
            element={user ? <PostPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/chats"
            element={user ? <Chatpage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/explore"
            element={user ? <ExplorePage /> : <Navigate to="/auth" />}
          />
        </Routes>
        {/* {user && <LogoutButton />} */}
        {user && <CreatePost />}
      </Container>
    </Box>
  );
}

export default App;
