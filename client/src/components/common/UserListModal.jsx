import React from "react";
import UserAvatar from "./UserAvatar";

const UserListModal = ({ open, onClose, title, users = [], onFollowToggle, currentUserFollowing = [], loading }) => {
   if (!open) return null;

   return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40'>
         <div className='bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 relative'>
            <button
               className='absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 text-gray-500'
               onClick={onClose}
               aria-label='Close'>
               <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
               </svg>
            </button>
            <h2 className='text-xl font-semibold text-charcoal-gray mb-4 text-center'>{title}</h2>
            {loading ? (
               <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maple-red'></div>
               </div>
            ) : users.length === 0 ? (
               <div className='text-center text-gray-500 py-8'>No users found.</div>
            ) : (
               <div className='space-y-4 max-h-80 overflow-y-auto pr-2'>
                  {users.map((user) => {
                     const isFollowing = currentUserFollowing.includes(user._id);
                     return (
                        <div key={user._id} className='flex items-center justify-between bg-gray-50 rounded-lg p-3'>
                           <div className='flex items-center gap-3 min-w-0'>
                              <UserAvatar user={user} size='md' />
                              <div className='min-w-0'>
                                 <div className='font-medium text-charcoal-gray truncate'>{user.name}</div>
                                 <div className='text-xs text-gray-500 truncate'>@{user.username}</div>
                              </div>
                           </div>
                           {onFollowToggle && (
                              <button
                                 className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-maple-red focus:ring-offset-2 ${
                                    isFollowing
                                       ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                       : "bg-maple-red text-white hover:bg-maple-red-dark"
                                 }`}
                                 onClick={() => onFollowToggle(user)}>
                                 {isFollowing ? "Unfollow" : "Follow"}
                              </button>
                           )}
                        </div>
                     );
                  })}
               </div>
            )}
         </div>
      </div>
   );
};

export default UserListModal;
