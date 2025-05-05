import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LandingPage = () => {
   const [openFaq, setOpenFaq] = useState(null);
   const [isVisible, setIsVisible] = useState({});
   const sectionRefs = {
      features: useRef(null),
      howItWorks: useRef(null),
      community: useRef(null),
      faq: useRef(null),
   };

   useEffect(() => {
      const observerOptions = {
         root: null,
         rootMargin: "0px",
         threshold: 0.1,
      };

      const observerCallback = (entries) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            }
         });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      Object.entries(sectionRefs).forEach(([key, ref]) => {
         if (ref.current) {
            observer.observe(ref.current);
         }
      });

      return () => {
         Object.values(sectionRefs).forEach((ref) => {
            if (ref.current) {
               observer.unobserve(ref.current);
            }
         });
      };
   }, []);

   const toggleFaq = (index) => {
      setOpenFaq(openFaq === index ? null : index);
   };
   return (
      <div className='bg-whisper-white'>
         {/* Hero Section */}
         <div className='relative overflow-hidden min-h-screen flex items-center'>
            {/* Background with animated overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-maple-red/90 to-maple-red/70 z-10 opacity-90'></div>
            <div className='absolute inset-0 z-5 bg-[url("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop")] bg-cover bg-center bg-fixed'></div>

            {/* Animated maple leaf pattern overlay */}
            <div className='absolute inset-0 z-15 opacity-10'>
               <div className='absolute top-10 left-[10%] w-20 h-20 animate-float-slow'>
                  <svg viewBox='0 0 24 24' fill='white'>
                     <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                  </svg>
               </div>
               <div className='absolute top-[30%] right-[15%] w-32 h-32 animate-float'>
                  <svg viewBox='0 0 24 24' fill='white'>
                     <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                  </svg>
               </div>
               <div className='absolute bottom-[20%] left-[20%] w-24 h-24 animate-float-slow-reverse'>
                  <svg viewBox='0 0 24 24' fill='white'>
                     <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                  </svg>
               </div>
            </div>

            {/* Hero content */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-20 flex flex-col md:flex-row items-center'>
               <div className='md:w-3/5 mb-12 md:mb-0'>
                  <motion.h1
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight'>
                     Connect with your{" "}
                     <span className='text-white relative'>
                        Canadian
                        <span className='absolute bottom-1 left-0 w-full h-2 bg-white/20 rounded-full'></span>
                     </span>{" "}
                     community
                  </motion.h1>
                  <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.4 }}
                     className='text-xl md:text-2xl text-white/90 mb-8'>
                     MapleConnect brings Canadians together through local events, neighborhood circles, and community exchanges.
                  </motion.p>
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.6 }}
                     className='flex flex-col sm:flex-row gap-4'>
                     <Link
                        to='/register'
                        className='btn-primary text-center py-3 px-8 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300'>
                        Join MapleConnect
                     </Link>
                     <Link
                        to='/login'
                        className='bg-white/20 hover:bg-white/30 text-white text-center py-3 px-8 text-base font-medium rounded-lg transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
                        Sign In
                     </Link>
                  </motion.div>
               </div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className='md:w-2/5 relative'>
                  <div className='relative mx-auto w-full max-w-md'>
                     <div className='absolute inset-0 bg-maple-red/20 rounded-2xl transform rotate-3 scale-105 backdrop-blur-sm'></div>
                     <div className='relative bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 overflow-hidden'>
                        <div className='flex items-center mb-6'>
                           <div className='w-12 h-12 bg-maple-red rounded-full flex items-center justify-center mr-4'>
                              <svg className='w-6 h-6 text-white' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                 <path
                                    d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z'
                                    fill='currentColor'
                                 />
                              </svg>
                           </div>
                           <div>
                              <h3 className='text-white font-bold text-lg'>MapleConnect</h3>
                              <p className='text-white/70 text-sm'>Your Canadian community</p>
                           </div>
                        </div>

                        <div className='space-y-4 mb-6'>
                           <div className='bg-white/10 p-4 rounded-lg'>
                              <div className='flex items-center'>
                                 <div className='w-10 h-10 rounded-full bg-warm-amber/20 flex items-center justify-center mr-3'>
                                    <svg className='w-5 h-5 text-warm-amber' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                       <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                       />
                                    </svg>
                                 </div>
                                 <div>
                                    <h4 className='text-white font-medium'>Neighborhood Cleanup</h4>
                                    <p className='text-white/70 text-sm'>Tomorrow at 10:00 AM</p>
                                 </div>
                              </div>
                           </div>

                           <div className='bg-white/10 p-4 rounded-lg'>
                              <div className='flex items-center'>
                                 <div className='w-10 h-10 rounded-full bg-community-green/20 flex items-center justify-center mr-3'>
                                    <svg className='w-5 h-5 text-community-green' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                       <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                       />
                                    </svg>
                                 </div>
                                 <div>
                                    <h4 className='text-white font-medium'>Garden Enthusiasts</h4>
                                    <p className='text-white/70 text-sm'>12 neighbors near you</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className='text-center'>
                           <span className='inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm backdrop-blur-sm'>
                              Join 5,000+ Canadians today
                           </span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  className='flex flex-col items-center'>
                  <span className='text-white/80 text-sm mb-2'>Scroll to explore</span>
                  <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                  </svg>
               </motion.div>
            </div>
         </div>

         {/* Features Section */}
         <div id='features' ref={sectionRefs.features} className='py-20 md:py-32 bg-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute top-0 right-0 w-1/3 h-1/3 bg-maple-red/5 rounded-bl-full -z-10'></div>
            <div className='absolute bottom-0 left-0 w-1/4 h-1/4 bg-warm-amber/5 rounded-tr-full -z-10'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className='text-center mb-20'>
                  <span className='inline-block px-4 py-1 bg-maple-red/10 rounded-full text-maple-red text-sm font-medium mb-4'>
                     Features
                  </span>
                  <h2 className='text-3xl md:text-5xl font-bold text-charcoal-gray mb-6'>Everything you need to build your community</h2>
                  <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                     MapleConnect provides all the tools you need to connect with your neighbors, organize events, and exchange goods and
                     services.
                  </p>
               </motion.div>

               <div className='grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12'>
                  {/* Feature 1 */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.6, delay: 0.2 }}
                     className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2'>
                     <div className='bg-maple-red/10 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-maple-red/20 transition-colors duration-300'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           className='h-8 w-8 text-maple-red'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                           />
                        </svg>
                     </div>
                     <h3 className='text-xl font-bold text-charcoal-gray mb-4'>Neighborhood Circles</h3>
                     <p className='text-gray-600 mb-6 text-lg'>
                        Create and join groups based on your location, interests, or community needs. Connect with like-minded Canadians in
                        your area.
                     </p>
                     <div className='pt-4 border-t border-gray-100'>
                        <Link
                           to='/register'
                           className='text-maple-red font-medium hover:text-red-700 inline-flex items-center group-hover:translate-x-1 transition-transform duration-300'>
                           Explore circles
                           <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 ml-1' viewBox='0 0 20 20' fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </Link>
                     </div>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.6, delay: 0.4 }}
                     className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2'>
                     <div className='bg-warm-amber/10 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-warm-amber/20 transition-colors duration-300'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           className='h-8 w-8 text-warm-amber'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                           />
                        </svg>
                     </div>
                     <h3 className='text-xl font-bold text-charcoal-gray mb-4'>Local Gatherings</h3>
                     <p className='text-gray-600 mb-6 text-lg'>
                        Discover and organize events in your community. From neighborhood cleanups to cultural celebrations, find ways to
                        connect in person.
                     </p>
                     <div className='pt-4 border-t border-gray-100'>
                        <Link
                           to='/register'
                           className='text-warm-amber font-medium hover:text-amber-600 inline-flex items-center group-hover:translate-x-1 transition-transform duration-300'>
                           Find events
                           <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 ml-1' viewBox='0 0 20 20' fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </Link>
                     </div>
                  </motion.div>

                  {/* Feature 3 */}
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.6, delay: 0.6 }}
                     className='bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2'>
                     <div className='bg-community-green/10 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-community-green/20 transition-colors duration-300'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           className='h-8 w-8 text-community-green'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                           />
                        </svg>
                     </div>
                     <h3 className='text-xl font-bold text-charcoal-gray mb-4'>Local Exchange</h3>
                     <p className='text-gray-600 mb-6 text-lg'>
                        Buy, sell, or trade goods and services within your community. Support local businesses and individuals while
                        reducing waste.
                     </p>
                     <div className='pt-4 border-t border-gray-100'>
                        <Link
                           to='/register'
                           className='text-community-green font-medium hover:text-green-700 inline-flex items-center group-hover:translate-x-1 transition-transform duration-300'>
                           Browse marketplace
                           <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 ml-1' viewBox='0 0 20 20' fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </Link>
                     </div>
                  </motion.div>
               </div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className='mt-16 text-center'>
                  <Link
                     to='/register'
                     className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-red-700 transition-colors'>
                     Get started for free
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 ml-2' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </Link>
               </motion.div>
            </div>
         </div>

         {/* How It Works Section */}
         <div id='howItWorks' ref={sectionRefs.howItWorks} className='py-24 md:py-32 bg-gray-50 relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent -z-10'></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.howItWorks ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className='text-center mb-20'>
                  <span className='inline-block px-4 py-1 bg-warm-amber/10 rounded-full text-warm-amber text-sm font-medium mb-4'>
                     How It Works
                  </span>
                  <h2 className='text-3xl md:text-5xl font-bold text-charcoal-gray mb-6'>Get started in three simple steps</h2>
                  <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                     Getting started with MapleConnect is easy. Follow these simple steps to connect with your community.
                  </p>
               </motion.div>

               <div className='relative'>
                  {/* Connection line */}
                  <div className='absolute top-24 left-1/2 transform -translate-x-1/2 w-0.5 h-[calc(100%-120px)] bg-gray-200 hidden md:block'></div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-16 relative'>
                     {/* Step 1 */}
                     <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isVisible.howItWorks ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='relative'>
                        <div className='flex flex-col items-center text-center'>
                           <div className='bg-maple-red text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg relative z-10'>
                              1
                           </div>
                           <h3 className='text-2xl font-bold text-charcoal-gray mb-4'>Create Your Profile</h3>
                           <p className='text-gray-600 text-lg'>
                              Sign up and create your profile with your location, interests, and skills. This helps us connect you with
                              relevant communities and neighbors.
                           </p>

                           <div className='mt-8 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full'>
                              <div className='flex items-center mb-3'>
                                 <div className='w-10 h-10 bg-gray-200 rounded-full mr-3'></div>
                                 <div className='flex-1'>
                                    <div className='h-3 bg-gray-200 rounded w-3/4 mb-2'></div>
                                    <div className='h-2 bg-gray-200 rounded w-1/2'></div>
                                 </div>
                              </div>
                              <div className='space-y-2'>
                                 <div className='h-2 bg-gray-200 rounded'></div>
                                 <div className='h-2 bg-gray-200 rounded'></div>
                                 <div className='h-2 bg-gray-200 rounded w-2/3'></div>
                              </div>
                           </div>
                        </div>
                     </motion.div>

                     {/* Step 2 */}
                     <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisible.howItWorks ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className='relative'>
                        <div className='flex flex-col items-center text-center'>
                           <div className='bg-warm-amber text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg relative z-10'>
                              2
                           </div>
                           <h3 className='text-2xl font-bold text-charcoal-gray mb-4'>Join Local Circles</h3>
                           <p className='text-gray-600 text-lg'>
                              Discover and join neighborhood circles based on your location and interests. Connect with neighbors who share
                              your passions and concerns.
                           </p>

                           <div className='mt-8 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full'>
                              <div className='flex items-center justify-between mb-3'>
                                 <div className='flex items-center'>
                                    <div className='w-8 h-8 bg-maple-red/20 rounded-full flex items-center justify-center mr-2'>
                                       <svg className='w-4 h-4 text-maple-red' fill='currentColor' viewBox='0 0 20 20'>
                                          <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                                       </svg>
                                    </div>
                                    <div>
                                       <div className='h-3 bg-gray-200 rounded w-24 mb-1'></div>
                                       <div className='h-2 bg-gray-200 rounded w-16'></div>
                                    </div>
                                 </div>
                                 <div className='h-6 bg-maple-red/10 rounded-full px-2 flex items-center'>
                                    <div className='h-2 bg-maple-red rounded w-12'></div>
                                 </div>
                              </div>
                              <div className='h-2 bg-gray-200 rounded mb-3'></div>
                              <div className='h-2 bg-gray-200 rounded w-3/4'></div>
                           </div>
                        </div>
                     </motion.div>

                     {/* Step 3 */}
                     <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isVisible.howItWorks ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className='relative'>
                        <div className='flex flex-col items-center text-center'>
                           <div className='bg-community-green text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-lg relative z-10'>
                              3
                           </div>
                           <h3 className='text-2xl font-bold text-charcoal-gray mb-4'>Engage & Connect</h3>
                           <p className='text-gray-600 text-lg'>
                              Participate in discussions, attend events, and exchange goods and services. Build meaningful connections and
                              strengthen your community.
                           </p>

                           <div className='mt-8 bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full'>
                              <div className='flex items-center mb-3'>
                                 <div className='w-10 h-10 bg-warm-amber/20 rounded-full flex items-center justify-center mr-3'>
                                    <svg className='w-5 h-5 text-warm-amber' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                       <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                       />
                                    </svg>
                                 </div>
                                 <div>
                                    <div className='h-3 bg-gray-200 rounded w-32 mb-1'></div>
                                    <div className='h-2 bg-gray-200 rounded w-20'></div>
                                 </div>
                              </div>
                              <div className='flex justify-between mt-3'>
                                 <div className='h-6 w-16 bg-gray-200 rounded-full'></div>
                                 <div className='h-6 w-16 bg-maple-red/10 text-maple-red rounded-full flex items-center justify-center text-xs font-medium'>
                                    Join
                                 </div>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  </div>
               </div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.howItWorks ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className='mt-20 text-center'>
                  <Link
                     to='/register'
                     className='bg-maple-red hover:bg-red-700 text-white py-4 px-10 rounded-lg text-lg font-medium transition-colors inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300'>
                     Join Now
                  </Link>
                  <p className='mt-4 text-gray-500'>No credit card required. Free forever.</p>
               </motion.div>
            </div>
         </div>

         {/* Community Showcase Section */}
         <div className='py-16 md:py-24 bg-whisper-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <div className='text-center mb-16'>
                  <h2 className='text-3xl md:text-4xl font-bold text-charcoal-gray mb-4'>Join a thriving Canadian community</h2>
                  <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                     See how Canadians across the country are using MapleConnect to build stronger communities.
                  </p>
               </div>

               <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12'>
                  {/* Community Story 1 */}
                  <div className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                     <div className='aspect-w-16 aspect-h-9 relative'>
                        <img
                           src='https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop'
                           alt='Community garden in Vancouver'
                           className='object-cover w-full h-full'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                        <div className='absolute bottom-4 left-4 text-white'>
                           <span className='bg-maple-red px-2 py-1 rounded text-xs font-medium'>Vancouver, BC</span>
                        </div>
                     </div>
                     <div className='p-6'>
                        <h3 className='text-xl font-semibold text-charcoal-gray mb-3'>Community Garden Initiative</h3>
                        <p className='text-gray-600 mb-4'>
                           "MapleConnect helped us organize our neighborhood garden project. We connected with local gardening enthusiasts,
                           shared resources, and transformed an empty lot into a thriving community space."
                        </p>
                        <div className='flex items-center'>
                           <img
                              src='https://randomuser.me/api/portraits/women/45.jpg'
                              alt='Sarah Chen'
                              className='w-10 h-10 rounded-full mr-3'
                           />
                           <div>
                              <p className='font-medium text-charcoal-gray'>Sarah Chen</p>
                              <p className='text-sm text-gray-500'>Community Garden Organizer</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Community Story 2 */}
                  <div className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
                     <div className='aspect-w-16 aspect-h-9 relative'>
                        <img
                           src='https://images.unsplash.com/photo-1536337005238-94b997371b40?q=80&w=2069&auto=format&fit=crop'
                           alt='Neighborhood festival in Toronto'
                           className='object-cover w-full h-full'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                        <div className='absolute bottom-4 left-4 text-white'>
                           <span className='bg-warm-amber px-2 py-1 rounded text-xs font-medium'>Toronto, ON</span>
                        </div>
                     </div>
                     <div className='p-6'>
                        <h3 className='text-xl font-semibold text-charcoal-gray mb-3'>Multicultural Street Festival</h3>
                        <p className='text-gray-600 mb-4'>
                           "Our annual street festival has grown tremendously thanks to MapleConnect. We've been able to coordinate with
                           local vendors, performers, and volunteers to create a celebration of our diverse neighborhood."
                        </p>
                        <div className='flex items-center'>
                           <img
                              src='https://randomuser.me/api/portraits/men/32.jpg'
                              alt='Miguel Rodriguez'
                              className='w-10 h-10 rounded-full mr-3'
                           />
                           <div>
                              <p className='font-medium text-charcoal-gray'>Miguel Rodriguez</p>
                              <p className='text-sm text-gray-500'>Festival Coordinator</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className='mt-12 text-center'>
                  <Link to='/register' className='btn-primary inline-flex items-center py-2 px-6 text-base font-medium rounded-lg'>
                     Start your community
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 ml-2' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </Link>
               </div>
            </div>
         </div>

         {/* FAQ Section */}
         <div id='faq' ref={sectionRefs.faq} className='py-24 md:py-32 bg-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-transparent -z-10'></div>
            <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-maple-red/5 rounded-full -z-10'></div>
            <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-warm-amber/5 rounded-full -z-10'></div>

            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className='text-center mb-20'>
                  <span className='inline-block px-4 py-1 bg-community-green/10 rounded-full text-community-green text-sm font-medium mb-4'>
                     FAQ
                  </span>
                  <h2 className='text-3xl md:text-5xl font-bold text-charcoal-gray mb-6'>Frequently asked questions</h2>
                  <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                     Find answers to common questions about MapleConnect and how it can help strengthen your community.
                  </p>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0 }}
                  animate={isVisible.faq ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className='space-y-6'>
                  {/* FAQ Item 1 */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.5, delay: 0.3 }}
                     className='border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                     <button
                        className='w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors'
                        onClick={() => toggleFaq(0)}>
                        <h3 className='text-xl font-bold text-charcoal-gray text-left'>Is MapleConnect only for Canadians?</h3>
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                              openFaq === 0 ? "bg-maple-red/10 text-maple-red" : "bg-gray-100 text-gray-500"
                           }`}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className={`h-5 w-5 transition-transform duration-300 ${openFaq === 0 ? "rotate-180" : ""}`}
                              viewBox='0 0 20 20'
                              fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </div>
                     </button>
                     <div
                        className={`bg-white px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                           openFaq === 0 ? "max-h-40 py-5" : "max-h-0 py-0"
                        }`}>
                        <p className='text-gray-600 text-lg'>
                           Yes, MapleConnect is designed specifically for Canadian communities. Our platform focuses on connecting neighbors
                           and building stronger local communities across Canada.
                        </p>
                     </div>
                  </motion.div>

                  {/* FAQ Item 2 */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.5, delay: 0.4 }}
                     className='border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                     <button
                        className='w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors'
                        onClick={() => toggleFaq(1)}>
                        <h3 className='text-xl font-bold text-charcoal-gray text-left'>How much does MapleConnect cost?</h3>
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                              openFaq === 1 ? "bg-maple-red/10 text-maple-red" : "bg-gray-100 text-gray-500"
                           }`}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className={`h-5 w-5 transition-transform duration-300 ${openFaq === 1 ? "rotate-180" : ""}`}
                              viewBox='0 0 20 20'
                              fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </div>
                     </button>
                     <div
                        className={`bg-white px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                           openFaq === 1 ? "max-h-40 py-5" : "max-h-0 py-0"
                        }`}>
                        <p className='text-gray-600 text-lg'>
                           MapleConnect is free to join and use! We believe in making community building accessible to everyone. We may
                           offer premium features in the future, but the core functionality will always remain free.
                        </p>
                     </div>
                  </motion.div>

                  {/* FAQ Item 3 */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.5, delay: 0.5 }}
                     className='border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                     <button
                        className='w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors'
                        onClick={() => toggleFaq(2)}>
                        <h3 className='text-xl font-bold text-charcoal-gray text-left'>
                           How is MapleConnect different from other social networks?
                        </h3>
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                              openFaq === 2 ? "bg-maple-red/10 text-maple-red" : "bg-gray-100 text-gray-500"
                           }`}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className={`h-5 w-5 transition-transform duration-300 ${openFaq === 2 ? "rotate-180" : ""}`}
                              viewBox='0 0 20 20'
                              fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </div>
                     </button>
                     <div
                        className={`bg-white px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                           openFaq === 2 ? "max-h-48 py-5" : "max-h-0 py-0"
                        }`}>
                        <p className='text-gray-600 text-lg'>
                           Unlike global social networks, MapleConnect is focused on local, real-world connections. We prioritize community
                           building, local events, and neighborhood exchanges rather than content consumption.
                        </p>
                     </div>
                  </motion.div>

                  {/* FAQ Item 4 */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                     transition={{ duration: 0.5, delay: 0.6 }}
                     className='border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
                     <button
                        className='w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors'
                        onClick={() => toggleFaq(3)}>
                        <h3 className='text-xl font-bold text-charcoal-gray text-left'>How does MapleConnect protect my privacy?</h3>
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                              openFaq === 3 ? "bg-maple-red/10 text-maple-red" : "bg-gray-100 text-gray-500"
                           }`}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className={`h-5 w-5 transition-transform duration-300 ${openFaq === 3 ? "rotate-180" : ""}`}
                              viewBox='0 0 20 20'
                              fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </div>
                     </button>
                     <div
                        className={`bg-white px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                           openFaq === 3 ? "max-h-40 py-5" : "max-h-0 py-0"
                        }`}>
                        <p className='text-gray-600 text-lg'>
                           We take privacy seriously. You control what information you share and with whom. We don't sell your data to
                           advertisers, and we use industry-standard security measures to protect your information.
                        </p>
                     </div>
                  </motion.div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className='mt-16 text-center'>
                  <p className='text-gray-600 mb-6 text-lg'>Have more questions? We're here to help.</p>
                  <Link
                     to='/support'
                     className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-red-700 transition-colors mr-4'>
                     Visit Support Center
                  </Link>
                  <Link
                     to='/register'
                     className='inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-charcoal-gray bg-white hover:bg-gray-50 transition-colors'>
                     Join MapleConnect
                  </Link>
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default LandingPage;
