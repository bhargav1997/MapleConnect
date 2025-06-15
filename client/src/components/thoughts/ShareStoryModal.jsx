import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiSend, FiCheck } from "react-icons/fi";
import { shareStoryInMessage } from "../../services/messageService";
import { getFollowers, getFollowing } from "../../services/userService";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../common/UserAvatar";

const ShareStoryModal = ({ isOpen, onClose, thought, onShare }) => {
   const { user } = useAuth();
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [sharing, setSharing] = useState(false);

   const fetchUsers = async () => {
      if (!user?.id) return;
      try {
         setLoading(true);
         setError("");
         // Fetch both followers and following
         const [followersRes, followingRes] = await Promise.all([getFollowers(user.id), getFollowing(user.id)]);
         // Normalize data
         const followers = Array.isArray(followersRes) ? followersRes : followersRes.data || [];
         const following = Array.isArray(followingRes) ? followingRes : followingRes.data || [];
         // Combine and deduplicate by _id
         const allUsersMap = {};
         [...followers, ...following].forEach((u) => {
            allUsersMap[u._id || u.id] = u;
         });
         setUsers(Object.values(allUsersMap));
      } catch (err) {
         setError(err.message || "Failed to load users");
         toast.error("Failed to load users");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (isOpen && user?.id) {
         fetchUsers();
      }
   }, [isOpen, user?.id]);

   const handleUserSelect = (selectedUser) => {
      setSelectedUsers((prev) => {
         const isSelected = prev.some((u) => (u._id || u.id) === (selectedUser._id || selectedUser.id));
         if (isSelected) {
            return prev.filter((u) => (u._id || u.id) !== (selectedUser._id || selectedUser.id));
         }
         return [...prev, selectedUser];
      });
   };

   const handleShare = async () => {
      if (selectedUsers.length === 0) return;

      try {
         setSharing(true);
         const promises = selectedUsers.map((selectedUser) => shareStoryInMessage(thought._id, selectedUser._id || selectedUser.id));

         await Promise.all(promises);
         toast.success(`Story shared with ${selectedUsers.length} ${selectedUsers.length === 1 ? "user" : "users"}`);
         onShare(selectedUsers);
         onClose();
      } catch (error) {
         console.error("Error sharing story:", error);
         toast.error("Failed to share story");
      } finally {
         setSharing(false);
      }
   };

   // Filter users based on search query
   const filteredUsers = users.filter(
      (u) => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.username?.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   if (!isOpen) return null;

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
         <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className='w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden'>
            {/* Header */}
            <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
               <h3 className='text-lg font-semibold text-gray-900'>Share Story</h3>
               <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                  <FiX className='w-5 h-5' />
               </button>
            </div>

            {/* Search */}
            <div className='p-4 border-b border-gray-100'>
               <div className='relative'>
                  <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                     type='text'
                     placeholder='Search users...'
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maple-red focus:border-transparent'
                  />
               </div>
            </div>

            {/* User List */}
            <div className='max-h-[300px] overflow-y-auto'>
               {loading ? (
                  <div className='space-y-4 p-4'>
                     {[1, 2, 3].map((i) => (
                        <div key={i} className='flex items-center space-x-4 p-4 bg-white rounded-xl animate-pulse'>
                           <div className='w-10 h-10 bg-gray-200 rounded-full' />
                           <div className='flex-1'>
                              <div className='h-4 bg-gray-200 rounded w-32 mb-2' />
                              <div className='h-3 bg-gray-200 rounded w-24' />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : error ? (
                  <div className='p-6 text-center'>
                     <p className='text-red-500 mb-3'>{error}</p>
                     <button
                        onClick={fetchUsers}
                        className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-colors'>
                        Try Again
                     </button>
                  </div>
               ) : filteredUsers.length === 0 ? (
                  <div className='p-6 text-center text-gray-500'>{searchQuery ? "No users found" : "No connections available"}</div>
               ) : (
                  filteredUsers.map((user) => (
                     <div
                        key={user._id || user.id}
                        onClick={() => handleUserSelect(user)}
                        className={`p-4 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                           selectedUsers.some((u) => (u._id || u.id) === (user._id || user.id)) ? "bg-maple-red/5" : ""
                        }`}>
                        <UserAvatar user={user} size='md' />
                        <div className='flex-1'>
                           <h4 className='font-medium text-gray-900'>{user.name}</h4>
                           <p className='text-sm text-gray-500'>@{user.username}</p>
                        </div>
                        {selectedUsers.some((u) => (u._id || u.id) === (user._id || user.id)) && (
                           <div className='w-5 h-5 rounded-full bg-maple-red flex items-center justify-center'>
                              <FiCheck className='w-3 h-3 text-white' />
                           </div>
                        )}
                     </div>
                  ))
               )}
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-gray-100'>
               <button
                  onClick={handleShare}
                  disabled={selectedUsers.length === 0 || sharing}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all transform active:scale-[0.98] ${
                     selectedUsers.length === 0 || sharing
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-maple-red text-white hover:bg-maple-red/90 shadow-lg shadow-maple-red/20"
                  }`}>
                  <FiSend className='w-4 h-4' />
                  <span>
                     {sharing ? "Sharing..." : `Share with ${selectedUsers.length} ${selectedUsers.length === 1 ? "user" : "users"}`}
                  </span>
               </button>
            </div>
         </motion.div>
      </motion.div>
   );
};

export default ShareStoryModal;
