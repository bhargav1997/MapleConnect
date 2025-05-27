import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";

const SocketContext = createContext();

export const useSocket = () => {
   const context = useContext(SocketContext);
   if (!context) {
      throw new Error("useSocket must be used within a SocketProvider");
   }
   return context;
};

export const SocketProvider = ({ children }) => {
   const [socket, setSocket] = useState(null);
   const { user } = useAuth();

   useEffect(() => {
      if (user) {
         const newSocket = io(api.defaults.baseURL, {
            withCredentials: true,
         });

         newSocket.on("connect", () => {
            console.log("Socket connected");
            newSocket.emit("join", user.id);
         });

         newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
         });

         newSocket.on("error", (error) => {
            console.error("Socket error:", error);
            toast.error(error.message || "Connection error");
         });

         setSocket(newSocket);

         return () => {
            newSocket.close();
         };
      }
   }, [user]);

   const sendMessage = (receiverId, message) => {
      if (socket) {
         socket.emit("private message", {
            senderId: user.id,
            receiverId,
            message,
         });
      }
   };

   const sendTypingStatus = (receiverId, isTyping) => {
      if (socket) {
         socket.emit("typing", {
            senderId: user.id,
            receiverId,
            isTyping,
         });
      }
   };

   const markAsRead = (senderId, messageIds) => {
      if (socket) {
         socket.emit("mark as read", {
            senderId,
            receiverId: user.id,
            messageIds,
         });
      }
   };

   const value = {
      socket,
      sendMessage,
      sendTypingStatus,
      markAsRead,
   };

   return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
