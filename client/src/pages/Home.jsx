import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getPosts } from "../services/postService";
import CreatePostModal from "../components/CreatePostModal";
import PostCard from "../components/PostCard";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
   const { user, isAuthenticated } = useAuth();
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [activeTab, setActiveTab] = useState("all");
   const [showWelcome, setShowWelcome] = useState(true);
   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
   const [trendingTopics, setTrendingTopics] = useState([
      { id: 1, name: "Canada Day", count: 1243 },
      { id: 2, name: "Vancouver", count: 856 },
      { id: 3, name: "Toronto Raptors", count: 712 },
      { id: 4, name: "Montreal Jazz Festival", count: 645 },
      { id: 5, name: "Maple Syrup", count: 532 },
   ]);
   const [suggestedUsers, setSuggestedUsers] = useState([
      { id: 1, name: "Sarah Thompson", location: "Toronto, ON", avatar: "S", color: "royal-blue" },
      { id: 2, name: "Michael Chen", location: "Vancouver, BC", avatar: "M", color: "teal-accent" },
      { id: 3, name: "Olivia Tremblay", location: "Montreal, QC", avatar: "O", color: "lavender-purple" },
      { id: 4, name: "Liam Wilson", location: "Calgary, AB", avatar: "L", color: "warm-amber" },
      { id: 5, name: "Emma Rodriguez", location: "Ottawa, ON", avatar: "E", color: "community-green" },
   ]);
   const [upcomingEvents, setUpcomingEvents] = useState([
      {
         id: 1,
         title: "Community Cleanup",
         date: "Tomorrow, 10:00 AM",
         location: "Stanley Park, Vancouver",
         color: "warm-amber",
         attendees: 24,
      },
      {
         id: 2,
         title: "Farmers Market",
         date: "Saturday, 9:00 AM",
         location: "City Square, Toronto",
         color: "community-green",
         attendees: 56,
      },
      {
         id: 3,
         title: "Tech Meetup",
         date: "Next Tuesday, 6:30 PM",
         location: "Innovation Hub, Montreal",
         color: "royal-blue",
         attendees: 42,
      },
   ]);

   const postListRef = useRef(null);

   const fetchPosts = async () => {
      try {
         setLoading(true);
         const response = await getPosts();
         setPosts(response.data);
         setError("");

         // Auto-hide welcome banner after first successful post load
         setTimeout(() => {
            setShowWelcome(false);
         }, 5000);
      } catch (err) {
         setError("Failed to load posts. Please try again later.");
         console.error("Error fetching posts:", err);
      } finally {
         setLoading(false);
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

                  <div className='px-6 pt-0 pb-6 relative'>
                     <div className='flex flex-col items-center'>
                        <div className='w-24 h-24 rounded-full bg-white mb-3 overflow-hidden border-4 border-white shadow-md -mt-12'>
                           {user?.profilePicture ? (
                              <img src={user.profilePicture} alt={user.name} className='w-full h-full object-cover' />
                           ) : (
                              <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-maple-red/80 to-maple-red'>
                                 <span className='text-2xl font-bold text-white'>{user?.name?.charAt(0).toUpperCase() || "M"}</span>
                              </div>
                           )}
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
                                 <div className='font-bold text-charcoal-gray'>{posts.length}</div>
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
                     <Link
                        to='/groups'
                        className='flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 text-charcoal-gray transition-colors group'>
                        <div className='w-9 h-9 rounded-full bg-royal-blue/10 flex items-center justify-center mr-3 group-hover:bg-royal-blue/20 transition-colors'>
                           <svg className='h-5 w-5 text-royal-blue' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                           </svg>
                        </div>
                        <div>
                           <span className='font-medium'>My Groups</span>
                           <p className='text-xs text-gray-500'>Join communities</p>
                        </div>
                     </Link>

                     <Link
                        to='/events'
                        className='flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 text-charcoal-gray mt-1 transition-colors group'>
                        <div className='w-9 h-9 rounded-full bg-warm-amber/10 flex items-center justify-center mr-3 group-hover:bg-warm-amber/20 transition-colors'>
                           <svg className='h-5 w-5 text-warm-amber' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                           </svg>
                        </div>
                        <div>
                           <span className='font-medium'>Events</span>
                           <p className='text-xs text-gray-500'>Find local activities</p>
                        </div>
                     </Link>

                     <Link
                        to='/marketplace'
                        className='flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 text-charcoal-gray mt-1 transition-colors group'>
                        <div className='w-9 h-9 rounded-full bg-teal-accent/10 flex items-center justify-center mr-3 group-hover:bg-teal-accent/20 transition-colors'>
                           <svg className='h-5 w-5 text-teal-accent' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                           </svg>
                        </div>
                        <div>
                           <span className='font-medium'>Marketplace</span>
                           <p className='text-xs text-gray-500'>Buy and sell items</p>
                        </div>
                     </Link>

                     <Link
                        to='/messages'
                        className='flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 text-charcoal-gray mt-1 transition-colors group'>
                        <div className='w-9 h-9 rounded-full bg-lavender-purple/10 flex items-center justify-center mr-3 group-hover:bg-lavender-purple/20 transition-colors'>
                           <svg className='h-5 w-5 text-lavender-purple' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                              />
                           </svg>
                        </div>
                        <div>
                           <span className='font-medium'>Messages</span>
                           <p className='text-xs text-gray-500'>Chat with friends</p>
                        </div>
                     </Link>
                  </nav>
               </div>

               {/* Trending Topics */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-royal-blue/5 to-royal-blue/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>Trending in Canada</h3>
                  </div>
                  <div className='p-4'>
                     {trendingTopics.map((topic) => (
                        <div key={topic.id} className='flex items-center justify-between py-2 border-b border-gray-100 last:border-0'>
                           <div>
                              <p className='font-medium text-charcoal-gray text-sm'>#{topic.name}</p>
                              <p className='text-xs text-gray-500'>{topic.count.toLocaleString()} posts</p>
                           </div>
                           <button className='text-royal-blue hover:text-royal-blue-light'>
                              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                              </svg>
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className='md:w-2/4'
               ref={postListRef}>
               {/* Post Creation Card */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6'>
                  <div className='p-4'>
                     <div
                        className='flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                        onClick={() => setIsPostModalOpen(true)}>
                        <div className='flex-shrink-0'>
                           {user?.profilePicture ? (
                              <img
                                 className='h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm'
                                 src={user.profilePicture}
                                 alt={user?.name}
                              />
                           ) : (
                              <div className='h-10 w-10 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white font-bold shadow-sm'>
                                 {user?.name?.charAt(0).toUpperCase() || "M"}
                              </div>
                           )}
                        </div>
                        <div className='flex-grow bg-gray-100 hover:bg-gray-200 transition-colors rounded-full py-2.5 px-4 text-gray-500'>
                           <span>What's on your mind, {user?.name?.split(" ")[0] || "there"}?</span>
                        </div>
                     </div>

                     <div className='flex mt-3 border-t border-gray-100 pt-3'>
                        <button
                           className='flex items-center justify-center gap-2 flex-1 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors'
                           onClick={() => setIsPostModalOpen(true)}>
                           <svg className='w-5 h-5 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
                              />
                           </svg>
                           <span className='font-medium text-sm'>Photo/Video</span>
                        </button>

                        <button
                           className='flex items-center justify-center gap-2 flex-1 py-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors'
                           onClick={() => setIsPostModalOpen(true)}>
                           <svg className='w-5 h-5 text-yellow-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           <span className='font-medium text-sm'>Feeling/Activity</span>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Post Creation Modal */}
               <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} onPostCreated={fetchPosts} />

               {/* Feed Tabs */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6'>
                  <div className='flex border-b border-gray-100'>
                     <button
                        onClick={() => setActiveTab("all")}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                           activeTab === "all"
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
                           All Posts
                        </span>
                     </button>
                     <button
                        onClick={() => setActiveTab("trending")}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                           activeTab === "trending"
                              ? "text-maple-red border-b-2 border-maple-red"
                              : "text-gray-500 hover:text-maple-red/80 hover:bg-gray-50"
                        }`}>
                        <span className='flex items-center justify-center'>
                           <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
                           </svg>
                           Trending
                        </span>
                     </button>
                     <button
                        onClick={() => setActiveTab("following")}
                        className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                           activeTab === "following"
                              ? "text-maple-red border-b-2 border-maple-red"
                              : "text-gray-500 hover:text-maple-red/80 hover:bg-gray-50"
                        }`}>
                        <span className='flex items-center justify-center'>
                           <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                              />
                           </svg>
                           Following
                        </span>
                     </button>
                  </div>
               </div>

               {/* Post Feed */}
               <AnimatePresence mode='wait'>
                  {loading ? (
                     <motion.div
                        key='loading'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-sm border border-gray-100'>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maple-red mb-4'></div>
                        <p className='text-gray-500'>Loading your feed...</p>
                     </motion.div>
                  ) : error ? (
                     <motion.div
                        key='error'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='bg-white rounded-xl shadow-sm p-6 border border-gray-100 my-6'>
                        <div className='bg-red-50 border border-red-100 rounded-lg p-4'>
                           <div className='flex'>
                              <div className='flex-shrink-0'>
                                 <svg
                                    className='h-5 w-5 text-red-400'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'>
                                    <path
                                       fillRule='evenodd'
                                       d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                              </div>
                              <div className='ml-3'>
                                 <p className='text-sm text-red-700'>{error}</p>
                                 <button onClick={fetchPosts} className='mt-2 text-xs text-maple-red hover:text-maple-red-dark font-medium'>
                                    Try again
                                 </button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ) : getFilteredPosts().length === 0 ? (
                     <motion.div
                        key='empty'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center'>
                        <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                           <svg
                              className='h-10 w-10 text-gray-400'
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
                        </div>
                        <h3 className='text-xl font-medium text-charcoal-gray'>No posts yet</h3>
                        <p className='mt-2 text-gray-500 max-w-md mx-auto'>
                           {activeTab === "following"
                              ? "Follow more people to see their posts in your feed."
                              : activeTab === "trending"
                              ? "There are no trending posts at the moment."
                              : "Start by creating a new post or follow more people."}
                        </p>
                        <div className='mt-6'>
                           <button
                              className='inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-maple-red hover:bg-maple-red-dark transition-colors'
                              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                              <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                              </svg>
                              Create Your First Post
                           </button>
                        </div>
                     </motion.div>
                  ) : (
                     <motion.div key='posts' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='space-y-6'>
                        {getFilteredPosts().map((post, index) => (
                           <motion.div
                              key={post._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}>
                              <PostCard post={post} onUpdate={fetchPosts} />
                           </motion.div>
                        ))}
                     </motion.div>
                  )}
               </AnimatePresence>
            </motion.div>

            {/* Right Sidebar */}
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5 }}
               className='md:w-1/4 space-y-6'>
               {/* Suggested Connections */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-lavender-purple/5 to-lavender-purple/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>People You May Know</h3>
                  </div>
                  <div className='p-4 space-y-4'>
                     {suggestedUsers.map((user, index) => (
                        <motion.div
                           key={user.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className='flex items-center'>
                           <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-br from-${user.color}/70 to-${user.color} flex items-center justify-center text-white font-bold mr-3 shadow-sm`}>
                              {user.avatar}
                           </div>
                           <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-charcoal-gray truncate'>{user.name}</p>
                              <p className='text-xs text-gray-500 truncate'>{user.location}</p>
                           </div>
                           <button className='ml-2 inline-flex items-center px-3 py-1.5 border border-gray-200 text-xs font-medium rounded-lg text-charcoal-gray bg-white hover:bg-gray-50 transition-colors'>
                              <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                              </svg>
                              Follow
                           </button>
                        </motion.div>
                     ))}
                  </div>
                  <div className='px-4 py-3 border-t border-gray-100 text-center'>
                     <Link
                        to='/discover'
                        className='text-sm text-lavender-purple hover:text-lavender-purple-light font-medium flex items-center justify-center'>
                        <span>Find More People</span>
                        <svg className='w-4 h-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                     </Link>
                  </div>
               </div>

               {/* Upcoming Events */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-warm-amber/5 to-warm-amber/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>Upcoming Events</h3>
                  </div>
                  <div className='p-4 space-y-4'>
                     {upcomingEvents.map((event, index) => (
                        <motion.div
                           key={event.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className={`p-4 bg-${event.color}/5 rounded-lg border border-${event.color}/10 hover:bg-${event.color}/10 transition-colors`}>
                           <div className='flex items-center mb-3'>
                              <div
                                 className={`w-10 h-10 rounded-full bg-${event.color}/10 flex items-center justify-center text-${event.color} mr-3`}>
                                 <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={1.5}
                                       d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                    />
                                 </svg>
                              </div>
                              <div>
                                 <h4 className='text-sm font-medium text-charcoal-gray'>{event.title}</h4>
                                 <p className='text-xs text-gray-500'>{event.date}</p>
                              </div>
                           </div>
                           <div className='text-xs text-gray-500 mb-3 flex items-center'>
                              <svg className='w-4 h-4 mr-1 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
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
                              {event.location}
                           </div>
                           <div className='flex justify-between items-center'>
                              <div className='text-xs text-gray-500'>{event.attendees} attending</div>
                              <button
                                 className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-${event.color} hover:bg-${event.color}-light transition-colors shadow-sm`}>
                                 RSVP
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </div>
                  <div className='px-4 py-3 border-t border-gray-100 text-center'>
                     <Link
                        to='/events'
                        className='text-sm text-warm-amber hover:text-warm-amber-light font-medium flex items-center justify-center'>
                        <span>View All Events</span>
                        <svg className='w-4 h-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                     </Link>
                  </div>
               </div>

               {/* Canadian News */}
               <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
                  <div className='px-4 py-3 bg-gradient-to-r from-royal-blue/5 to-royal-blue/10 border-b border-gray-100'>
                     <h3 className='font-semibold text-charcoal-gray'>Canadian News</h3>
                  </div>
                  <div className='p-4 space-y-4'>
                     <div className='border-b border-gray-100 pb-3'>
                        <div className='text-xs text-royal-blue font-medium mb-1'>NATIONAL</div>
                        <h4 className='text-sm font-medium text-charcoal-gray mb-1'>Canada Celebrates Record Tourism Growth in 2023</h4>
                        <p className='text-xs text-gray-500'>Tourism industry reports highest visitor numbers since pre-pandemic era.</p>
                     </div>
                     <div className='border-b border-gray-100 pb-3'>
                        <div className='text-xs text-community-green font-medium mb-1'>ENVIRONMENT</div>
                        <h4 className='text-sm font-medium text-charcoal-gray mb-1'>
                           New Conservation Efforts Launched in British Columbia
                        </h4>
                        <p className='text-xs text-gray-500'>
                           Initiative aims to protect endangered species and preserve natural habitats.
                        </p>
                     </div>
                     <div>
                        <div className='text-xs text-warm-amber font-medium mb-1'>CULTURE</div>
                        <h4 className='text-sm font-medium text-charcoal-gray mb-1'>Montreal Jazz Festival Announces Lineup for 2023</h4>
                        <p className='text-xs text-gray-500'>World-renowned musicians set to perform at Canada's premier jazz event.</p>
                     </div>
                  </div>
                  <div className='px-4 py-3 border-t border-gray-100 text-center'>
                     <Link
                        to='/news'
                        className='text-sm text-royal-blue hover:text-royal-blue-light font-medium flex items-center justify-center'>
                        <span>Read More News</span>
                        <svg className='w-4 h-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                     </Link>
                  </div>
               </div>
            </motion.div>
         </div>
      </div>
   );
};

export default Home;
