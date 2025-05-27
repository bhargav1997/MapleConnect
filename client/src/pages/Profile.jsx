import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserById, getUserPosts, followUser, unfollowUser, updateProfileImage, updateUser } from "../services/userService";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { getUserInitials } from "../utils/helpers";
import defaultCoverImage from "../assets/default-cover.png";
import defaultUserImage from "../assets/default-user.png";

const Profile = () => {
   const { id } = useParams();
   const { user: currentUser } = useAuth();

   const [user, setUser] = useState(null);
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [activeTab, setActiveTab] = useState("posts");
   const [followLoading, setFollowLoading] = useState(false);

   // Bio editing state
   const [editingBio, setEditingBio] = useState(false);
   const [bioText, setBioText] = useState("");
   const [bioSaving, setBioSaving] = useState(false);
   const [bioError, setBioError] = useState("");

   // Username editing state
   const [editingUsername, setEditingUsername] = useState(false);
   const [usernameText, setUsernameText] = useState("");
   const [usernameSaving, setUsernameSaving] = useState(false);
   const [usernameError, setUsernameError] = useState("");

   const isCurrentUser = currentUser?.id === id;
   const isFollowing = user?.followers.includes(currentUser?.id);

   const fetchUserData = async () => {
      try {
         setLoading(true);
         const userResponse = await getUserById(id);
         setUser(userResponse.data);

         // Set bio and username text when user data is loaded
         if (userResponse.data.bio) {
            setBioText(userResponse.data.bio);
         }

         if (userResponse.data.username) {
            setUsernameText(userResponse.data.username);
         }

         const postsResponse = await getUserPosts(id);
         setPosts(postsResponse.data);

         setError("");
      } catch (err) {
         setError("Failed to load profile. Please try again later.");
         console.error("Error fetching profile:", err);
      } finally {
         setLoading(false);
      }
   };

   // Handle saving bio
   const handleSaveBio = async () => {
      if (!isCurrentUser) return;

      setBioSaving(true);
      setBioError("");

      try {
         // Call API to update user bio
         await updateUser(currentUser.id, {
            bio: bioText,
         });

         // Update user data in state
         setUser((prevUser) => ({
            ...prevUser,
            bio: bioText,
         }));

         // Close edit mode
         setEditingBio(false);
      } catch (err) {
         setBioError(err.response?.data?.error || "Failed to update bio. Please try again.");
         console.error("Error updating bio:", err);
      } finally {
         setBioSaving(false);
      }
   };

   // Handle saving username
   const handleSaveUsername = async () => {
      if (!isCurrentUser) return;

      setUsernameSaving(true);
      setUsernameError("");

      // Validate username
      if (!usernameText) {
         setUsernameError("Username is required");
         setUsernameSaving(false);
         return;
      }

      if (!/^[a-zA-Z0-9_.]+$/.test(usernameText)) {
         setUsernameError("Username can only contain letters, numbers, underscores and dots");
         setUsernameSaving(false);
         return;
      }

      if (usernameText.length > 30) {
         setUsernameError("Username cannot be more than 30 characters");
         setUsernameSaving(false);
         return;
      }

      try {
         // Call API to update username
         await updateUser(currentUser.id, {
            username: usernameText,
         });

         // Update user data in state
         setUser((prevUser) => ({
            ...prevUser,
            username: usernameText,
         }));

         // Close edit mode
         setEditingUsername(false);
      } catch (err) {
         setUsernameError(err.response?.data?.error || "Failed to update username. Please try again.");
         console.error("Error updating username:", err);
      } finally {
         setUsernameSaving(false);
      }
   };

   useEffect(() => {
      fetchUserData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   const handleFollow = async () => {
      try {
         setFollowLoading(true);
         if (isFollowing) {
            await unfollowUser(id);
         } else {
            await followUser(id);
         }
         // Fetch updated user data
         const response = await getUserById(id);
         if (response.success) {
            setUser(response.data);
         }
      } catch (err) {
         setError("Failed to update follow status. Please try again.");
         console.error("Error following/unfollowing:", err);
      } finally {
         setFollowLoading(false);
      }
   };

   const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
         await updateProfileImage(currentUser.id, file);
         fetchUserData();
      } catch (err) {
         setError("Failed to update profile image. Please try again.");
         console.error("Error updating profile image:", err);
      }
   };

   if (loading) {
      return (
         <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maple-red'></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='max-w-4xl mx-auto px-4 py-8'>
            <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className='bg-red-50 border border-red-100 rounded-lg p-4 shadow-sm'>
               <div className='flex'>
                  <div className='flex-shrink-0'>
                     <svg className='h-5 w-5 text-red-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </div>
                  <div className='ml-3'>
                     <p className='text-sm text-red-700'>{error}</p>
                     <button onClick={() => fetchUserData()} className='mt-2 text-xs text-maple-red hover:text-red-700 font-medium'>
                        Try again
                     </button>
                  </div>
               </div>
            </motion.div>
         </div>
      );
   }

   if (!user) {
      return (
         <div className='max-w-4xl mx-auto px-4 py-8'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='bg-white rounded-lg shadow-sm p-8 text-center'>
               <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg className='h-10 w-10 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                     />
                  </svg>
               </div>
               <h3 className='text-xl font-semibold text-charcoal-gray mb-2'>User not found</h3>
               <p className='text-gray-500 mb-6'>The user you're looking for doesn't exist or may have been removed.</p>
               <Link to='/home' className='inline-flex items-center text-maple-red hover:text-red-700 font-medium'>
                  <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                  </svg>
                  Return to home
               </Link>
            </motion.div>
         </div>
      );
   }

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='max-w-4xl mx-auto px-4 py-8'>
         {/* Profile Header */}
         <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-6'>
            <div className='h-48 bg-gray-300 relative'>
               <img src={user?.coverImage ? user.coverImage : defaultCoverImage} alt={user?.name} className='w-full h-full object-cover' />
            </div>
            <div className='px-6 py-6 sm:px-8'>
               <div className='flex flex-col'>
                  <div className='flex flex-col sm:flex-row'>
                     <div className='relative -mt-24 mb-4 sm:mb-0 flex-shrink-0'>
                        <div className='h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-gray-100 shadow-md relative'>
                           <img
                              src={user?.profileImage ? user.profileImage : defaultUserImage}
                              alt={user?.name}
                              className='h-full w-full object-cover'
                           />
                           {/* Hover label with circular camera icon */}
                           <label className='absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-all duration-200 cursor-pointer'>
                              <div className='h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md'>
                                 <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-5 w-5 text-black'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                                    />
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                 </svg>
                              </div>
                              <input type='file' className='hidden' accept='image/*' onChange={handleImageUpload} />
                           </label>
                        </div>
                     </div>

                     <div className='sm:ml-6 flex-1 min-w-0'>
                        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between'>
                           <div className='min-w-0 max-w-full'>
                              <h2 className='text-2xl font-bold text-charcoal-gray truncate'>{user.name}</h2>
                              {user.username && <p className='text-sm text-maple-red font-medium truncate'>@{user.username}</p>}
                              <div className='text-sm text-gray-500 mt-1'>
                                 {user.location && (
                                    <div className='flex items-center'>
                                       <svg
                                          className='w-4 h-4 mr-1 text-gray-400 flex-shrink-0'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          stroke='currentColor'>
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={1.5}
                                             d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                          />
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={1.5}
                                             d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                          />
                                       </svg>
                                       <span className='truncate'>{user.location}</span>
                                    </div>
                                 )}
                                 <div className='flex items-center mt-1'>
                                    <svg
                                       className='w-4 h-4 mr-1 text-gray-400 flex-shrink-0'
                                       fill='none'
                                       viewBox='0 0 24 24'
                                       stroke='currentColor'>
                                       <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={1.5}
                                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                       />
                                    </svg>
                                    <span className='truncate'>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                           <div className='mt-4 sm:mt-0 flex-shrink-0'>
                              {!isCurrentUser && (
                                 <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleFollow}
                                    disabled={followLoading}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                                       isFollowing
                                          ? "bg-gray-100 text-charcoal-gray hover:bg-gray-200 border border-gray-200"
                                          : "bg-maple-red text-white hover:bg-red-700"
                                    } ${followLoading ? "opacity-75 cursor-not-allowed" : ""}`}>
                                    {followLoading ? (
                                       <span className='flex items-center'>
                                          <svg
                                             className='animate-spin -ml-1 mr-2 h-4 w-4 text-current'
                                             xmlns='http://www.w3.org/2000/svg'
                                             fill='none'
                                             viewBox='0 0 24 24'>
                                             <circle
                                                className='opacity-25'
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                strokeWidth='4'></circle>
                                             <path
                                                className='opacity-75'
                                                fill='currentColor'
                                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                          </svg>
                                          Processing...
                                       </span>
                                    ) : isFollowing ? (
                                       <span className='flex items-center'>
                                          <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                          </svg>
                                          Following
                                       </span>
                                    ) : (
                                       <span className='flex items-center'>
                                          <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                             <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                          </svg>
                                          Follow
                                       </span>
                                    )}
                                 </motion.button>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>

                  {user.bio && (
                     <div className='mt-4 max-w-full'>
                        <p className='text-gray-700 break-words'>{user.bio}</p>
                     </div>
                  )}

                  <div className='mt-6 grid grid-cols-3 gap-3'>
                     <div className='bg-gray-50 px-3 py-2 rounded-lg text-center'>
                        <div className='font-semibold text-charcoal-gray text-lg'>{user.following.length}</div>
                        <div className='text-gray-500 text-sm'>Following</div>
                     </div>
                     <div className='bg-gray-50 px-3 py-2 rounded-lg text-center'>
                        <div className='font-semibold text-charcoal-gray text-lg'>{user.followers.length}</div>
                        <div className='text-gray-500 text-sm'>Followers</div>
                     </div>
                     <div className='bg-gray-50 px-3 py-2 rounded-lg text-center'>
                        <div className='font-semibold text-charcoal-gray text-lg'>{posts.length}</div>
                        <div className='text-gray-500 text-sm'>Posts</div>
                     </div>
                  </div>
               </div>

               {/* Profile Tabs */}
               <div className='border-t border-gray-100 mt-4'>
                  <div className='flex'>
                     <button
                        onClick={() => setActiveTab("posts")}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                           activeTab === "posts"
                              ? "text-maple-red border-b-2 border-maple-red"
                              : "text-gray-500 hover:text-maple-red/80 hover:bg-gray-50"
                        }`}>
                        <span className='flex items-center justify-center'>
                           <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v12a2 2 0 002 2h5z'
                              />
                           </svg>
                           Posts
                        </span>
                     </button>
                     <button
                        onClick={() => setActiveTab("about")}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                           activeTab === "about"
                              ? "text-maple-red border-b-2 border-maple-red"
                              : "text-gray-500 hover:text-maple-red/80 hover:bg-gray-50"
                        }`}>
                        <span className='flex items-center justify-center'>
                           <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                           </svg>
                           About
                        </span>
                     </button>
                  </div>
               </div>
            </div>

            {/* Profile Content */}
            {activeTab === "posts" ? (
               <div>
                  {posts.length === 0 ? (
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100'>
                        <svg
                           className='mx-auto h-16 w-16 text-gray-300'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'
                           aria-hidden='true'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                           />
                        </svg>
                        <h3 className='mt-4 text-lg font-medium text-charcoal-gray'>No posts yet</h3>
                        <p className='mt-2 text-gray-500 max-w-md mx-auto'>
                           {isCurrentUser
                              ? "Share your thoughts, photos, and updates with your community."
                              : `${user.name} hasn't shared any posts yet.`}
                        </p>
                        {isCurrentUser && (
                           <div className='mt-6'>
                              <Link
                                 to='/home'
                                 className='inline-flex items-center px-5 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-maple-red hover:bg-red-700 transition-colors'>
                                 <svg
                                    className='-ml-1 mr-2 h-5 w-5'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    aria-hidden='true'>
                                    <path
                                       fillRule='evenodd'
                                       d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                                 Create a post
                              </Link>
                           </div>
                        )}
                     </motion.div>
                  ) : (
                     <div className='space-y-6'>
                        {posts.map((post, index) => (
                           <motion.div
                              key={post._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}>
                              <PostCard post={post} onUpdate={fetchUserData} />
                           </motion.div>
                        ))}
                     </div>
                  )}
               </div>
            ) : (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-white rounded-xl shadow-md p-8 border border-gray-100'>
                  <div className='flex justify-between items-center mb-6'>
                     <h3 className='text-xl font-bold text-charcoal-gray'>About {user.name}</h3>
                     {isCurrentUser && (
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setEditingBio(!editingBio)}
                           className='text-maple-red hover:text-maple-red-dark transition-colors'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                              />
                           </svg>
                        </motion.button>
                     )}
                  </div>

                  <div className='space-y-8'>
                     {/* Bio Section */}
                     <motion.div
                        className={`p-5 rounded-xl ${user.bio ? "bg-maple-red/5" : "bg-gray-50"} relative overflow-hidden`}
                        whileHover={isCurrentUser && !editingBio ? { scale: 1.01 } : {}}>
                        <div className='absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 opacity-5'>
                           <svg viewBox='0 0 24 24' fill='currentColor' className='text-maple-red'>
                              <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                           </svg>
                        </div>

                        <div className='flex items-start'>
                           <div className='w-12 h-12 rounded-full bg-maple-red/15 flex items-center justify-center mr-4 shadow-sm'>
                              <svg className='w-6 h-6 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 6h16M4 12h16m-7 6h7' />
                              </svg>
                           </div>
                           <div className='flex-1'>
                              <h4 className='text-sm font-medium text-gray-500 mb-2'>Bio</h4>

                              {isCurrentUser && editingBio ? (
                                 <div>
                                    <textarea
                                       value={bioText}
                                       onChange={(e) => setBioText(e.target.value)}
                                       className='w-full p-3 border border-gray-300 rounded-lg focus:ring-maple-red focus:border-maple-red transition-colors'
                                       rows={4}
                                       maxLength={500}
                                       placeholder='Write something about yourself...'
                                    />
                                    <div className='flex justify-between mt-2'>
                                       <span className='text-xs text-gray-500'>{bioText.length}/500 characters</span>
                                       <div className='space-x-2'>
                                          <motion.button
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             type='button'
                                             onClick={() => {
                                                setBioText(user.bio || "");
                                                setEditingBio(false);
                                             }}
                                             className='px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'>
                                             Cancel
                                          </motion.button>
                                          <motion.button
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             type='button'
                                             onClick={handleSaveBio}
                                             disabled={bioSaving}
                                             className={`px-3 py-1 text-sm rounded-md text-white ${
                                                bioSaving ? "bg-maple-red/60" : "bg-maple-red hover:bg-maple-red-dark"
                                             } transition-colors`}>
                                             {bioSaving ? "Saving..." : "Save"}
                                          </motion.button>
                                       </div>
                                    </div>
                                    {bioError && <p className='mt-2 text-sm text-red-600'>{bioError}</p>}
                                 </div>
                              ) : (
                                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='relative'>
                                    {user.bio ? (
                                       <p className='text-lg text-charcoal-gray whitespace-pre-wrap'>{user.bio}</p>
                                    ) : (
                                       <p className='text-gray-400 italic'>
                                          {isCurrentUser
                                             ? "You haven't added a bio yet. Click the edit button to add one."
                                             : `${user.name} hasn't added a bio yet.`}
                                       </p>
                                    )}

                                    {isCurrentUser && !editingBio && (
                                       <div
                                          className='absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 hover:opacity-100 transition-opacity cursor-pointer'
                                          onClick={() => setEditingBio(true)}>
                                          <span className='bg-maple-red text-white px-3 py-1 rounded-full text-sm font-medium shadow-md'>
                                             {user.bio ? "Edit Bio" : "Add Bio"}
                                          </span>
                                       </div>
                                    )}
                                 </motion.div>
                              )}
                           </div>
                        </div>
                     </motion.div>

                     {/* Personal Information */}
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <motion.div whileHover={{ scale: 1.02 }} className='flex items-start p-4 rounded-xl bg-gray-50'>
                           <div className='w-12 h-12 rounded-full bg-maple-red/15 flex items-center justify-center mr-4 shadow-sm'>
                              <svg className='w-6 h-6 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                 />
                              </svg>
                           </div>
                           <div>
                              <h4 className='text-sm font-medium text-gray-500'>Name</h4>
                              <p className='mt-1 text-lg font-medium text-charcoal-gray'>{user.name}</p>
                           </div>
                        </motion.div>

                        {/* Username Section */}
                        <motion.div
                           whileHover={{ scale: 1.02 }}
                           className={`flex items-start p-4 rounded-xl ${
                              editingUsername ? "bg-maple-red/5 border border-maple-red/20" : "bg-gray-50"
                           }`}>
                           <div className='w-12 h-12 rounded-full bg-maple-red/15 flex items-center justify-center mr-4 shadow-sm'>
                              <svg className='w-6 h-6 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                 />
                              </svg>
                           </div>
                           <div className='flex-1'>
                              <div className='flex justify-between items-center'>
                                 <h4 className='text-sm font-medium text-gray-500'>Username</h4>
                                 {isCurrentUser && !editingUsername && (
                                    <button
                                       onClick={() => setEditingUsername(true)}
                                       className='text-xs text-maple-red hover:text-maple-red-dark transition-colors'>
                                       Edit
                                    </button>
                                 )}
                              </div>

                              {isCurrentUser && editingUsername ? (
                                 <div className='mt-1'>
                                    <input
                                       type='text'
                                       value={usernameText}
                                       onChange={(e) => setUsernameText(e.target.value)}
                                       className='w-full p-2 border border-gray-300 rounded-lg focus:ring-maple-red focus:border-maple-red transition-colors'
                                       placeholder='Enter username'
                                       maxLength={30}
                                    />
                                    <div className='flex justify-between mt-2'>
                                       <span className='text-xs text-gray-500'>{usernameText.length}/30 characters</span>
                                       <div className='space-x-2'>
                                          <motion.button
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             type='button'
                                             onClick={() => {
                                                setUsernameText(user.username || "");
                                                setEditingUsername(false);
                                             }}
                                             className='px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors'>
                                             Cancel
                                          </motion.button>
                                          <motion.button
                                             whileHover={{ scale: 1.05 }}
                                             whileTap={{ scale: 0.95 }}
                                             type='button'
                                             onClick={handleSaveUsername}
                                             disabled={usernameSaving}
                                             className={`px-3 py-1 text-xs rounded-md text-white ${
                                                usernameSaving ? "bg-maple-red/60" : "bg-maple-red hover:bg-maple-red-dark"
                                             } transition-colors`}>
                                             {usernameSaving ? "Saving..." : "Save"}
                                          </motion.button>
                                       </div>
                                    </div>
                                    {usernameError && <p className='mt-2 text-xs text-red-600'>{usernameError}</p>}
                                 </div>
                              ) : (
                                 <p className='mt-1 text-lg font-medium text-charcoal-gray'>
                                    {user.username ? `@${user.username}` : "No username set"}
                                 </p>
                              )}
                           </div>
                        </motion.div>

                        {user.location && (
                           <motion.div whileHover={{ scale: 1.02 }} className='flex items-start p-4 rounded-xl bg-gray-50'>
                              <div className='w-12 h-12 rounded-full bg-warm-amber/15 flex items-center justify-center mr-4 shadow-sm'>
                                 <svg className='w-6 h-6 text-warm-amber' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={1.5}
                                       d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                    />
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={1.5}
                                       d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                 </svg>
                              </div>
                              <div>
                                 <h4 className='text-sm font-medium text-gray-500'>Location</h4>
                                 <p className='mt-1 text-lg font-medium text-charcoal-gray'>{user.location}</p>
                              </div>
                           </motion.div>
                        )}

                        <motion.div whileHover={{ scale: 1.02 }} className='flex items-start p-4 rounded-xl bg-gray-50'>
                           <div className='w-12 h-12 rounded-full bg-community-green/15 flex items-center justify-center mr-4 shadow-sm'>
                              <svg className='w-6 h-6 text-community-green' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                 />
                              </svg>
                           </div>
                           <div>
                              <h4 className='text-sm font-medium text-gray-500'>Joined</h4>
                              <p className='mt-1 text-lg font-medium text-charcoal-gray'>
                                 {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                              </p>
                           </div>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }} className='flex items-start p-4 rounded-xl bg-gray-50'>
                           <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 shadow-sm'>
                              <svg className='w-6 h-6 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                 />
                              </svg>
                           </div>
                           <div className='w-full overflow-hidden'>
                              <h4 className='text-sm font-medium text-gray-500'>Email</h4>
                              <p className='mt-1 text-lg font-medium text-charcoal-gray truncate' title={user.email}>
                                 {user.email}
                              </p>
                           </div>
                        </motion.div>
                     </div>
                  </div>
               </motion.div>
            )}
         </div>
      </motion.div>
   );
};

export default Profile;
