import React from "react";
import { Link } from "react-router-dom";
import SupportLayout from "../../components/support/SupportLayout";

const Support = () => {
   const supportCategories = [
      {
         title: "Getting Started",
         icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
         description: "Learn how to set up your account and get started with MapleConnect.",
         link: "/support/help-center#getting-started",
      },
      {
         title: "Account & Profile",
         icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
         description: "Manage your account settings, profile information, and privacy.",
         link: "/support/help-center#account",
      },
      {
         title: "Neighbourhood Circles",
         icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
         description: "Learn about creating and joining community groups in your area.",
         link: "/support/help-center#circles",
      },
      {
         title: "Local Gatherings",
         icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
         description: "Discover how to create, find, and join events in your community.",
         link: "/support/help-center#events",
      },
      {
         title: "Local Exchange",
         icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
         description: "Learn how to buy, sell, and exchange items with your neighbors.",
         link: "/support/help-center#marketplace",
      },
      {
         title: "Safety & Community",
         icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
         description: "Guidelines for keeping our community safe and welcoming for everyone.",
         link: "/support/community-guidelines",
      },
   ];

   return (
      <SupportLayout
         title='How can we help you?'
         description='Find answers to your questions and learn how to get the most out of MapleConnect.'>
         <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {supportCategories.map((category, index) => (
               <Link
                  key={index}
                  to={category.link}
                  className='block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors'>
                  <div className='flex items-start'>
                     <div className='flex-shrink-0'>
                        <div className='p-2 bg-maple-red/10 rounded-lg'>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-6 w-6 text-maple-red'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d={category.icon} />
                           </svg>
                        </div>
                     </div>
                     <div className='ml-4'>
                        <h3 className='text-lg font-medium text-gray-900'>{category.title}</h3>
                        <p className='mt-1 text-sm text-gray-600'>{category.description}</p>
                     </div>
                  </div>
               </Link>
            ))}
         </div>

         <div className='mt-10'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Frequently Asked Questions</h2>

            <div className='space-y-4'>
               <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <button className='w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50'>
                     <span className='text-base font-medium text-gray-900'>How do I create a neighborhood circle?</span>
                     <svg className='h-5 w-5 text-gray-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </button>
                  <div className='px-4 pb-4'>
                     <p className='text-gray-600'>
                        To create a neighborhood circle, navigate to the Circles page and click on "Create Circle." Fill in the required
                        information about your circle, including name, description, location, and privacy settings. Once created, you can
                        invite neighbors to join your circle.
                     </p>
                  </div>
               </div>

               <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <button className='w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50'>
                     <span className='text-base font-medium text-gray-900'>How do I report inappropriate content?</span>
                     <svg className='h-5 w-5 text-gray-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </button>
                  <div className='px-4 pb-4'>
                     <p className='text-gray-600'>
                        If you come across content that violates our Community Guidelines, click the three dots (...) next to the post,
                        comment, or profile, and select "Report." Choose the appropriate reason for reporting and submit. Our moderation
                        team will review the report and take appropriate action.
                     </p>
                  </div>
               </div>

               <div className='border border-gray-200 rounded-lg overflow-hidden'>
                  <button className='w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50'>
                     <span className='text-base font-medium text-gray-900'>How can I control who sees my profile?</span>
                     <svg className='h-5 w-5 text-gray-500' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </button>
                  <div className='px-4 pb-4'>
                     <p className='text-gray-600'>
                        You can control your privacy settings by going to Settings &gt; Privacy. From there, you can adjust who can see your
                        profile, posts, and personal information. You can choose from options like "Public," "Neighbors Only," or "Only Me"
                        for different aspects of your profile.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         <div className='mt-10 text-center'>
            <p className='text-gray-600'>Can't find what you're looking for?</p>
            <Link
               to='/contact'
               className='mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-red-700'>
               Contact Support
            </Link>
         </div>
      </SupportLayout>
   );
};

export default Support;
