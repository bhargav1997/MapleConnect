import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getPosts } from "../services/postService";
import CreatePostModal from "../components/CreatePostModal";
import PostCard from "../components/PostCard";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PeopleYouMayKnow from "../components/suggestions/PeopleYouMayKnow";
import defaultUserImage from "../assets/default-user.png";

const Home = () => {
   const { user, isAuthenticated } = useAuth();
   const [posts, setPosts] = useState([]);
   const [myPostsLength, setMyPostsLength] = useState(0);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [activeTab, setActiveTab] = useState("all");

   const [showWelcome, setShowWelcome] = useState(true);
   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
   const [trendingTopics, setTrendingTopics] = useState([]);
   const [upcomingEvents, setUpcomingEvents] = useState([]);

   const postListRef = useRef(null);

   const fetchPosts = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await getPosts();
         setPosts(response.data || []);
         let myPosts = response.data.filter((post) => post.user._id === user.id);
         setMyPostsLength(myPosts.length);
      } catch (err) {
         console.error("Error fetching posts:", err);
         setError(err.message || "Failed to load posts. Please try again later.");
      } finally {
         setLoading(false);
         // Auto-hide welcome banner after first post load attempt
         setTimeout(() => {
            setShowWelcome(false);
         }, 5000);
      }
   };


   const getFilteredPosts = () => {
      if (activeTab === "all") {
         return posts;
      } else if (activeTab === "trending") {
         // In a real app, you would have a trending algorithm
         // For now, just sort by likes count
         return [...posts].sort((a, b) => b.likes.length - a.likes.length);
      } else if (activeTab === "following") {
         // In a real app, filter posts from users the current user follows
         // For demo purposes, just return a subset
         return posts.filter((_, index) => index % 2 === 0);
      }
      return posts;
   };

   const scrollToPostList = () => {
      if (postListRef.current) {
         postListRef.current.scrollIntoView({ behavior: "smooth" });
      }
   };

   useEffect(() => {
      if (isAuthenticated) {
         fetchPosts();
      }

      // Set a timeout to hide the welcome banner after 10 seconds
      const welcomeTimer = setTimeout(() => {
         setShowWelcome(false);
      }, 10000);

      return () => clearTimeout(welcomeTimer);
   }, [isAuthenticated]);

   return (
      <div className='flex flex-col max-w-7xl mx-auto px-4 py-6'>
         {/* Welcome Banner */}
         <AnimatePresence>
            {showWelcome && (
               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='w-full mb-6 relative overflow-hidden'>
                  <div className='bg-gradient-to-r from-maple-red to-maple-red-dark rounded-xl shadow-lg p-6 md:p-8 relative z-10'>
                     <button onClick={() => setShowWelcome(false)} className='absolute top-3 right-3 text-white/80 hover:text-white'>
                        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     </button>

                     <div className='flex flex-col md:flex-row items-center'>
                        <div className='mb-4 md:mb-0 md:mr-6'>
                           <div className='w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center'>
                              <svg className='w-10 h-10 md:w-12 md:h-12 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                                 />
                              </svg>
                           </div>
                        </div>
                        <div className='text-center md:text-left'>
                           <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>Welcome to MapleConnect!</h2>
                           <p className='text-white/90 mb-4 max-w-2xl'>
                              Connect with fellow Canadians, share your experiences, and discover events happening across the country.
                           </p>
                           <div className='flex flex-col sm:flex-row gap-3 justify-center md:justify-start'>
                              <button
                                 onClick={scrollToPostList}
                                 className='px-5 py-2.5 bg-white text-maple-red font-medium rounded-lg hover:bg-white/90 transition-colors shadow-sm'>
                                 Create Your First Post
                              </button>
                              <button className='px-5 py-2.5 bg-white/20 text-white font-medium rounded-lg hover:bg-white/30 transition-colors'>
                                 Find People to Follow
                              </button>
                           </div>
                        </div>
                     </div>

                     {/* Decorative elements */}
                     <div className='absolute top-0 right-0 w-64 h-64 opacity-10'>
                        <svg viewBox='0 0 24 24' fill='white' className='w-full h-full'>
                           <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                        </svg>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Main Content */}
         <div className='flex flex-col md:flex-row gap-6'>
            {/* Left Sidebar */}
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5 }}
               className='md:w-1/4 space-y-6'>
               {/* User Profile Card */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='h-32 bg-gradient-to-r from-maple-red/90 to-maple-red-dark relative overflow-hidden'>
                     {/* Decorative maple leaves */}
                     <div className='absolute right-3 top-3 opacity-20'>
                        <svg className='w-16 h-16' viewBox='0 0 24 24' fill='white'>
                           <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                        </svg>
                     </div>
                     <div className='absolute left-3 bottom-3 opacity-10 rotate-45'>
                        <svg className='w-12 h-12' viewBox='0 0 24 24' fill='white'>
                           <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                        </svg>
                     </div>
                     <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5'>
                        <svg className='w-40 h-40' viewBox='0 0 24 24' fill='white'>
                           <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                        </svg>
                     </div>
                  </div>
                  {console.log("user", user)}
                  <div className='px-6 pt-0 pb-6 relative'>
                     <div className='flex flex-col items-center'>
                        <div className='w-24 h-24 rounded-full bg-white mb-3 overflow-hidden border-4 border-white shadow-md -mt-12'>
                           <img
                              src={user?.profileImage ? user.profileImage : defaultUserImage}
                              alt={user.name}
                              className='w-full h-full object-cover'
                           />
                        </div>
                        <h3 className='text-lg font-bold text-charcoal-gray'>{user?.name || "MapleConnect User"}</h3>
                        <p className='text-sm text-gray-500 mb-3'>
                           @{user?.username || user?.name?.toLowerCase().replace(/\s/g, "") || "user"}
                        </p>

                        <Link
                           to={`/profile/${user?.id}`}
                           className='text-sm text-maple-red hover:text-maple-red-dark font-medium flex items-center mb-4'>
                           <span>View Profile</span>
                           <svg className='w-4 h-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                           </svg>
                        </Link>

                        <div className='w-full bg-gray-50 rounded-lg p-3'>
                           <div className='flex justify-between text-center'>
                              <div className='flex-1'>
                                 <div className='font-bold text-charcoal-gray'>{myPostsLength}</div>
                                 <div className='text-xs text-gray-500'>Posts</div>
                              </div>
                              <div className='flex-1 border-x border-gray-200'>
                                 <div className='font-bold text-charcoal-gray'>{user?.following?.length || 0}</div>
                                 <div className='text-xs text-gray-500'>Following</div>
                              </div>
                              <div className='flex-1'>
                                 <div className='font-bold text-charcoal-gray'>{user?.followers?.length || 0}</div>
                                 <div className='text-xs text-gray-500'>Followers</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Quick Links */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>Quick Links</h3>
                  </div>
                  <nav className='p-2'>
                     <Link to='/events' className='flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'>
                        <svg className='w-5 h-5 mr-3 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                           />
                        </svg>
                        Events
                     </Link>
                     <Link to='/groups' className='flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'>
                        <svg className='w-5 h-5 mr-3 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                           />
                        </svg>
                        Groups
                     </Link>
                     <Link
                        to='/marketplace'
                        className='flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors'>
                        <svg className='w-5 h-5 mr-3 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                           />
                        </svg>
                        Marketplace
                     </Link>
                  </nav>
               </div>

               {/* People You May Know */}
               <PeopleYouMayKnow />
            </motion.div>
            {console.log("user", user)}
            {/* Main Content 2 */}
            <div className='flex-1 space-y-6'>
               {/* Create Post */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='p-4'>
                     <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 rounded-full bg-gray-100 overflow-hidden'>
                           <img
                              src={user.profileImage ? user.profileImage : defaultUserImage}
                              alt={user.name}
                              className='w-full h-full object-cover'
                           />
                        </div>
                        <button
                           onClick={() => setIsPostModalOpen(true)}
                           className='flex-1 text-left px-4 py-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors'>
                           What's on your mind?
                        </button>
                     </div>
                  </div>
               </div>

               {/* Post Tabs */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='flex border-b border-gray-100'>
                     <button
                        onClick={() => setActiveTab("all")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                           activeTab === "all" ? "text-maple-red border-b-2 border-maple-red" : "text-gray-500 hover:text-gray-700"
                        }`}>
                        All Posts
                     </button>
                     <button
                        onClick={() => setActiveTab("trending")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                           activeTab === "trending" ? "text-maple-red border-b-2 border-maple-red" : "text-gray-500 hover:text-gray-700"
                        }`}>
                        Trending
                     </button>
                     <button
                        onClick={() => setActiveTab("following")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                           activeTab === "following" ? "text-maple-red border-b-2 border-maple-red" : "text-gray-500 hover:text-gray-700"
                        }`}>
                        Following
                     </button>
                  </div>
               </div>

               {/* Posts List */}
               <div ref={postListRef} className='space-y-6'>
                  {loading ? (
                     // Loading skeleton
                     Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse'>
                           <div className='p-4'>
                              <div className='flex items-center space-x-3 mb-4'>
                                 <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                                 <div className='flex-1'>
                                    <div className='h-4 w-24 bg-gray-200 rounded mb-2'></div>
                                    <div className='h-3 w-32 bg-gray-200 rounded'></div>
                                 </div>
                              </div>
                              <div className='space-y-3'>
                                 <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                 <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : error ? (
                     // Error state
                     <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-4'>
                        <div className='text-center text-red-500'>{error}</div>
                     </div>
                  ) : posts.length === 0 ? (
                     // Empty state
                     <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-8'>
                        <div className='text-center'>
                           <div className='w-16 h-16 mx-auto mb-4 text-gray-400'>
                              <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                                 />
                              </svg>
                           </div>
                           <h3 className='text-lg font-semibold text-gray-900 mb-2'>No Posts Yet</h3>
                           <p className='text-gray-500 mb-4'>Be the first to share something with your community!</p>
                           <button
                              onClick={() => setIsPostModalOpen(true)}
                              className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-red-700 transition-colors'>
                              Create Post
                           </button>
                        </div>
                     </div>
                  ) : (
                     // Posts list
                     getFilteredPosts().map((post) => <PostCard key={post._id} post={post} />)
                  )}
               </div>
            </div>

            {/* Right Sidebar */}
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5 }}
               className='md:w-1/4 space-y-6'>
               {/* Trending Topics */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>Trending Topics</h3>
                  </div>
                  <div className='p-4'>
                     {trendingTopics.length === 0 ? (
                        <div className='text-center py-4'>
                           <div className='w-12 h-12 mx-auto mb-3 text-gray-400'>
                              <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
                                 />
                              </svg>
                           </div>
                           <p className='text-sm text-gray-500'>No trending topics yet</p>
                           <p className='text-xs text-gray-400 mt-1'>Be the first to start a conversation!</p>
                        </div>
                     ) : (
                        trendingTopics.map((topic) => (
                           <div key={topic.id} className='flex items-center justify-between mb-3 last:mb-0'>
                              <span className='text-sm text-gray-700'>#{topic.name}</span>
                              <span className='text-xs text-gray-500'>{topic.count} posts</span>
                           </div>
                        ))
                     )}
                  </div>
               </div>

               {/* Upcoming Events */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-maple-red/5 to-maple-red/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>Upcoming Events</h3>
                  </div>
                  <div className='p-4'>
                     {upcomingEvents.length === 0 ? (
                        <div className='text-center py-4'>
                           <div className='w-12 h-12 mx-auto mb-3 text-gray-400'>
                              <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                 />
                              </svg>
                           </div>
                           <p className='text-sm text-gray-500'>No upcoming events</p>
                           <p className='text-xs text-gray-400 mt-1'>Check back later for new events!</p>
                           <Link to='/events' className='inline-block mt-3 text-sm text-maple-red hover:text-maple-red-dark font-medium'>
                              Browse Events
                           </Link>
                        </div>
                     ) : (
                        upcomingEvents.map((event) => (
                           <div key={event.id} className='mb-4 last:mb-0'>
                              <div className='flex items-start space-x-3'>
                                 <div className={`w-2 h-2 rounded-full mt-2 bg-${event.color}`}></div>
                                 <div>
                                    <h4 className='text-sm font-medium text-gray-900'>{event.title}</h4>
                                    <p className='text-xs text-gray-500'>{event.date}</p>
                                    <p className='text-xs text-gray-500'>{event.location}</p>
                                    <div className='flex items-center mt-1'>
                                       <svg className='w-4 h-4 text-gray-400 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={2}
                                             d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                          />
                                       </svg>
                                       <span className='text-xs text-gray-500'>{event.attendees} attending</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Create Post Modal */}
         <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      </div>
   );
};

export default Home;
