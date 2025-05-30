import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFollowers, getFollowing } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../common/UserAvatar";

const ChatUsers = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const { user } = useAuth();

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
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, [user?.id]);

   if (loading) {
      return (
         <div className='space-y-4 p-4'>
            {[1, 2, 3].map((i) => (
               <div key={i} className='flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm animate-pulse'>
                  <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                  <div className='flex-1'>
                     <div className='h-4 bg-gray-200 rounded w-32 mb-2'></div>
                     <div className='h-3 bg-gray-200 rounded w-48'></div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className='text-center p-8'>
            <div className='w-16 h-16 mx-auto mb-4 text-red-500'>
               <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
               </svg>
            </div>
            <p className='text-red-500 text-lg font-medium mb-2'>{error}</p>
            <button onClick={fetchUsers} className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-colors'>
               Try Again
            </button>
         </div>
      );
   }

   if (users.length === 0) {
      return (
         <div className='text-center p-8'>
            <div className='w-20 h-20 mx-auto mb-4 text-gray-400'>
               <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
               </svg>
            </div>
            <p className='text-gray-600 text-lg font-medium mb-2'>No users found</p>
            <p className='text-sm text-gray-500'>{"No users to chat with yet. Follow someone or let them follow you to start a chat!"}</p>
         </div>
      );
   }

   return (
      <div className='p-4'>
         <div className='space-y-3'>
            {users.map((user) => (
               <div key={user._id || user.id} className='group relative transform transition-all hover:scale-[1.02] hover:shadow-md'>
                  <Link
                     to={`/messages/${user._id || user.id}`}
                     className='flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-maple-red/20 transition-colors'>
                     <UserAvatar user={user} size='lg' />
                     <div className='flex-1 min-w-0'>
                        <h3 className='text-base font-semibold text-charcoal-gray truncate group-hover:text-maple-red transition-colors'>
                           {user.name}
                        </h3>
                        <p className='text-sm text-gray-500 truncate mt-1'>{user.bio || "No bio yet"}</p>
                     </div>
                     <div className='text-maple-red opacity-0 group-hover:opacity-100 transition-opacity'>
                        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                           />
                        </svg>
                     </div>
                  </Link>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ChatUsers;
