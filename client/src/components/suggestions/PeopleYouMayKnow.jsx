import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSuggestedUsers, followUser, unfollowUser, getUserById } from "../../services/userService";
import toast from "react-hot-toast";
import UserAvatar from "../common/UserAvatar";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/authSlice";
import { useAuth } from "../../context/AuthContext";

const PeopleYouMayKnow = () => {
   const [suggestedUsers, setSuggestedUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const dispatch = useDispatch();
   const { user } = useAuth();

   const fetchSuggestedUsers = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await getSuggestedUsers();
         setSuggestedUsers(response.data || []);
      } catch (err) {
         console.error("Error fetching suggested users:", err);
         setError(err.message || "Failed to load suggested users");
      } finally {
         setLoading(false);
      }
   };

   const handleFollow = async (userId) => {
      try {
         await followUser(userId);
         // Update user state in Redux
         const updatedUser = {
            ...user,
            following: [...user.following, userId],
         };
         dispatch(updateUser(updatedUser));
         // Fetch updated user data
         const response = await getUserById(userId);
         if (response.success) {
            // Update the user in the suggested users list
            setSuggestedUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, followers: response.data.followers } : u)));
         }
         toast.success("Successfully followed user!");
      } catch (err) {
         console.error("Error following user:", err);
         toast.error(err.message || "Failed to follow user");
      }
   };

   useEffect(() => {
      fetchSuggestedUsers();
   }, []);

   if (loading) {
      return (
         <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
            <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
               <h3 className='font-semibold text-charcoal-gray'>People You May Know</h3>
            </div>
            <div className='p-4 space-y-4'>
               {[1, 2, 3].map((i) => (
                  <div key={i} className='flex items-center animate-pulse'>
                     <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                     <div className='ml-3 flex-1'>
                        <div className='h-4 bg-gray-200 rounded w-24 mb-2'></div>
                        <div className='h-3 bg-gray-200 rounded w-32'></div>
                     </div>
                     <div className='w-20 h-8 bg-gray-200 rounded'></div>
                  </div>
               ))}
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
            <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
               <h3 className='font-semibold text-charcoal-gray'>People You May Know</h3>
            </div>
            <div className='p-4 text-center'>
               <p className='text-sm text-red-500'>{error}</p>
               <button onClick={fetchSuggestedUsers} className='mt-2 text-sm text-maple-red hover:text-maple-red-dark font-medium'>
                  Try Again
               </button>
            </div>
         </div>
      );
   }

   if (suggestedUsers.length === 0) {
      return (
         <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
            <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
               <h3 className='font-semibold text-charcoal-gray'>People You May Know</h3>
            </div>
            <div className='p-4 text-center'>
               <div className='w-16 h-16 mx-auto mb-3 text-gray-400'>
                  <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                     />
                  </svg>
               </div>
               <p className='text-sm text-gray-500'>No suggestions available</p>
               <p className='text-xs text-gray-400 mt-1'>Try following more people to get better suggestions</p>
               <Link to='/discover' className='inline-block mt-3 text-sm text-maple-red hover:text-maple-red-dark font-medium'>
                  Discover People
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
         <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
            <h3 className='font-semibold text-charcoal-gray'>People You May Know</h3>
         </div>
         <div className='p-4 space-y-4'>
            {suggestedUsers.map((user) => (
               <div key={user._id} className='flex items-center'>
                  <UserAvatar user={user} size='md' />
                  <div className='ml-3 flex-1 min-w-0'>
                     <Link to={`/profile/${user._id}`} className='block'>
                        <p className='text-sm font-medium text-charcoal-gray truncate'>{user.name}</p>
                        <p className='text-xs text-gray-500 truncate'>@{user.username}</p>
                     </Link>
                  </div>
                  <button
                     onClick={() => handleFollow(user._id)}
                     className='ml-2 inline-flex items-center px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-charcoal-gray bg-white hover:bg-gray-50 transition-colors'>
                     <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                     </svg>
                     Follow
                  </button>
               </div>
            ))}
         </div>
         <div className='px-4 py-3 border-t border-gray-100 text-center'>
            <Link to='/discover' className='text-sm text-maple-red hover:text-maple-red-dark font-medium flex items-center justify-center'>
               <span>Find More People</span>
               <svg className='w-4 h-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
               </svg>
            </Link>
         </div>
      </div>
   );
};

export default PeopleYouMayKnow;
