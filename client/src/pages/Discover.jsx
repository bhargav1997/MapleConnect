import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { searchUsers, followUser, unfollowUser, getSuggestedUsers } from "../services/userService";
import { getUserInitials } from "../utils/helpers";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/authSlice";
import UserAvatar from "../components/common/UserAvatar";

const Discover = () => {
   const { isAuthenticated, user } = useAuth();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [followingStates, setFollowingStates] = useState({});
   const [error, setError] = useState("");

   useEffect(() => {
      if (!isAuthenticated) {
         navigate("/login");
         return;
      }
      fetchUsers();
   }, [isAuthenticated, navigate]);

   const fetchUsers = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await getSuggestedUsers();
         if (response.success && Array.isArray(response.data)) {
            setUsers(response.data);
            // Initialize following states
            const states = {};
            response.data.forEach((user) => {
               states[user._id] = user.followers?.includes(user._id) || false;
            });
            setFollowingStates(states);
         } else {
            console.error("Invalid response format:", response);
            setError("Failed to load users. Please try again.");
         }
      } catch (error) {
         console.error("Error fetching users:", error);
         setError(error.response?.data?.message || "Failed to load users. Please try again.");
         toast.error(error.response?.data?.message || "Failed to load users");
      } finally {
         setLoading(false);
      }
   };

   const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) {
         fetchUsers();
         return;
      }

      try {
         setLoading(true);
         setError("");
         const response = await searchUsers(searchQuery);
         if (response.success && Array.isArray(response.data)) {
            setUsers(response.data);
            // Update following states for new results
            const states = {};
            response.data.forEach((user) => {
               states[user._id] = user.followers?.includes(user._id) || false;
            });
            setFollowingStates(states);
         } else {
            console.error("Invalid response format:", response);
            setError("Failed to search users. Please try again.");
         }
      } catch (error) {
         console.error("Error searching users:", error);
         setError(error.response?.data?.message || "Failed to search users. Please try again.");
         toast.error(error.response?.data?.message || "Failed to search users");
      } finally {
         setLoading(false);
      }
   };

   const handleFollow = async (userId) => {
      try {
         if (followingStates[userId]) {
            await unfollowUser(userId);
            setFollowingStates((prev) => ({ ...prev, [userId]: false }));
            // Update user state in Redux
            const updatedUser = {
               ...user,
               following: user.following.filter((id) => id !== userId),
            };
            dispatch(updateUser(updatedUser));
            toast.success("Unfollowed successfully");
         } else {
            await followUser(userId);
            setFollowingStates((prev) => ({ ...prev, [userId]: true }));
            // Update user state in Redux
            const updatedUser = {
               ...user,
               following: [...user.following, userId],
            };
            dispatch(updateUser(updatedUser));
            toast.success("Followed successfully");
         }
      } catch (error) {
         console.error("Error following/unfollowing user:", error);
         toast.error(error.response?.data?.message || "Failed to update follow status");
      }
   };

   if (!isAuthenticated) {
      return null; // Will redirect to login in useEffect
   }

   return (
      <div className='max-w-7xl mx-auto px-4 py-8'>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <div className='p-6 border-b border-gray-100'>
               <h1 className='text-2xl font-bold text-gray-900 mb-4'>Discover People</h1>
               <form onSubmit={handleSearch} className='flex gap-4'>
                  <div className='flex-1'>
                     <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search by name or username...'
                        className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-maple-red focus:border-transparent'
                     />
                  </div>
                  <button type='submit' className='px-6 py-2 bg-maple-red text-white rounded-lg hover:bg-red-700 transition-colors'>
                     Search
                  </button>
               </form>
            </div>

            <div className='divide-y divide-gray-100'>
               {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                     <div key={index} className='p-6 animate-pulse'>
                        <div className='flex items-center space-x-4'>
                           <div className='h-12 w-12 bg-gray-200 rounded-full'></div>
                           <div className='flex-1'>
                              <div className='h-4 w-32 bg-gray-200 rounded mb-2'></div>
                              <div className='h-3 w-24 bg-gray-200 rounded'></div>
                           </div>
                           <div className='h-8 w-20 bg-gray-200 rounded'></div>
                        </div>
                     </div>
                  ))
               ) : error ? (
                  <div className='p-6 text-center'>
                     <p className='text-red-500 mb-4'>{error}</p>
                     <button
                        onClick={fetchUsers}
                        className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-red-700 transition-colors'>
                        Try Again
                     </button>
                  </div>
               ) : users.length === 0 ? (
                  <div className='p-6 text-center'>
                     <div className='w-16 h-16 mx-auto mb-4 text-gray-400'>
                        <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                           />
                        </svg>
                     </div>
                     <p className='text-gray-500 mb-2'>No users found</p>
                     <p className='text-sm text-gray-400'>Try searching with different keywords</p>
                  </div>
               ) : (
                  users.map((user) => (
                     <div key={user._id} className='p-6'>
                        <div className='flex items-center justify-between'>
                           <div className='flex items-center space-x-4'>
                              <UserAvatar user={user} size='md' />
                              <div>
                                 <Link
                                    to={`/profile/${user._id}`}
                                    className='text-base font-medium text-gray-900 hover:text-maple-red transition-colors'>
                                    {user.name}
                                 </Link>
                                 {user.username && <p className='text-sm text-gray-500'>@{user.username}</p>}
                                 {user.bio && <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{user.bio}</p>}
                              </div>
                           </div>
                           <button
                              onClick={() => handleFollow(user._id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                 followingStates[user._id]
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-maple-red text-white hover:bg-red-700"
                              }`}>
                              {followingStates[user._id] ? "Following" : "Follow"}
                           </button>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </motion.div>
      </div>
   );
};

export default Discover;
