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

// Utility to get the correct socket URL (strip /api if present)
const getSocketUrl = () => {
   let url = api.defaults.baseURL;
   if (url.endsWith("/api")) {
      url = url.replace(/\/api$/, "");
   }
   return url;
};

export const SocketProvider = ({ children }) => {
   const [socket, setSocket] = useState(null);
   const { user } = useAuth();

   useEffect(() => {
      if (user) {
         const newSocket = io(getSocketUrl(), {
            withCredentials: true,
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
         });

         newSocket.on("connect", () => {
            console.log("Socket connected");
            newSocket.emit("join", user._id);
         });

         newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            toast.error("Connection error. Please try again.");
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
            if (newSocket) {
               newSocket.close();
            }
         };
      }
   }, [user]);

   const sendMessage = (receiverId, message) => {
      if (socket) {
         console.log("Sending message:", { sender: user._id ? user._id : user.id, receiver: receiverId, message });
         socket.emit("private message", {
            sender: user._id ? user._id : user.id,
            receiver: receiverId,
            message,
         });
      }
   };

   const sendTypingStatus = (receiverId) => {
      if (socket) {
         socket.emit("typing", {
            senderId: user._id,
            receiverId,
         });
      }
   };

   const markAsRead = (senderId, messageIds) => {
      if (socket) {
         socket.emit("mark as read", {
            senderId,
            receiverId: user._id,
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
