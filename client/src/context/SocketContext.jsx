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
   const [unreadMessageCount, setUnreadMessageCount] = useState(0);
   const [onlineUsers, setOnlineUsers] = useState(new Set());
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
            setOnlineUsers(new Set());
         });

         newSocket.on("error", (error) => {
            console.error("Socket error:", error);
            toast.error(error.message || "Connection error");
         });

         // Listen for new messages to update unread count
         newSocket.on("new message", (data) => {
            if (data.sender !== user._id) {
               // Only increment if we're not in the chat with this sender
               const currentPath = window.location.pathname;
               const isInChat = currentPath.includes(`/messages/${data.sender}`);
               if (!isInChat) {
                  console.log("Incrementing unread count for new message");
                  setUnreadMessageCount((prev) => prev + 1);
               }
            }
         });

         // Listen for message notifications
         newSocket.on("message notification", (data) => {
            if (data.sender !== user._id) {
               const senderName = data.message.sender.name || "Someone";
               toast.custom(
                  (t) => (
                     <div
                        className={`${
                           t.visible ? "animate-enter" : "animate-leave"
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                        <div className='flex-1 w-0 p-4'>
                           <div className='flex items-start'>
                              <div className='ml-3 flex-1'>
                                 <p className='text-sm font-medium text-gray-900'>{senderName}</p>
                                 <p className='mt-1 text-sm text-gray-500'>{data.message.content}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  ),
                  {
                     duration: 4000,
                     position: "top-right",
                  },
               );
            }
         });

         // Listen for messages being read
         newSocket.on("messages read", (data) => {
            console.log("Messages read event received:", data);
         });

         // Listen for unread count updates
         newSocket.on("unread count updated", (data) => {
            console.log("Unread count updated:", data.count);
            setUnreadMessageCount(data.count);
         });

         // Listen for user status updates
         newSocket.on("user_status", (data) => {
            setOnlineUsers((prev) => {
               const newSet = new Set(prev);
               if (data.status === "online") {
                  newSet.add(data.userId);
               } else {
                  newSet.delete(data.userId);
               }
               return newSet;
            });
         });

         setSocket(newSocket);

         // Fetch initial unread count
         const fetchUnreadCount = async () => {
            try {
               const response = await api.get("/chats/messages/unread/count");
               console.log("Initial unread count:", response.data.count);
               setUnreadMessageCount(response.data.count);
            } catch (error) {
               console.error("Error fetching unread count:", error);
            }
         };
         fetchUnreadCount();

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
         console.log("Marking messages as read:", { senderId, messageIds });
         socket.emit("mark as read", {
            senderId,
            receiverId: user._id,
            messageIds: messageIds, // Empty array will mark all messages as read
            markAll: messageIds.length === 0, // Add flag to indicate if we should mark all messages
         });
      }
   };

   const isUserOnline = (userId) => {
      return onlineUsers.has(userId);
   };

   const value = {
      socket,
      sendMessage,
      sendTypingStatus,
      markAsRead,
      unreadMessageCount,
      isUserOnline,
   };

   return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
