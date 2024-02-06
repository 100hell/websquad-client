import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import userAtom from "../src/atom/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useRecoilValue(userAtom);
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      query: {
        userId: user?._id,
      },
      transports: ["websocket"],
      extraHeaders: ["Content-Type", "Authorization"],
    });
    setSocket(socket);

    socket.on("getOnlineusers", (users) => {
      setOnlineUsers(users);
    });
    return () => socket && socket.close();
  }, [user?._id]);
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
