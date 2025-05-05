import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
   const currentYear = new Date().getFullYear();

   return (
      <footer className='bg-gray-900 text-white'>
         {/* Top wave separator */}
         <div className='bg-white'>
            <svg
               xmlns='http://www.w3.org/2000/svg'
               viewBox='0 0 1440 48'
               className='w-full h-12 -mb-1 text-gray-900'
               preserveAspectRatio='none'
               fill='currentColor'>
               <path d='M0,0 C480,40 960,40 1440,0 L1440,48 L0,48 Z'></path>
            </svg>
         </div>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
               {/* Logo and description */}
               <div className='col-span-1 md:col-span-1'>
                  <Link to='/' className='flex items-center'>
                     <svg className='h-8 w-8 text-maple-red mr-2' viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                     </svg>
                     <span className='text-xl font-bold text-white'>
                        <span className='text-maple-red'>Maple</span>Connect
                     </span>
                  </Link>
                  <p className='mt-4 text-gray-300 text-sm'>
                     Connecting Canadian communities through local engagement, events, and exchanges.
                  </p>
                  <div className='mt-4 flex space-x-4'>
                     <a href='#' className='text-gray-400 hover:text-maple-red transition-colors'>
                        <span className='sr-only'>Facebook</span>
                        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                           <path
                              fillRule='evenodd'
                              d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </a>
                     <a href='#' className='text-gray-400 hover:text-maple-red transition-colors'>
                        <span className='sr-only'>Instagram</span>
                        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                           <path
                              fillRule='evenodd'
                              d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </a>
                     <a href='#' className='text-gray-400 hover:text-maple-red transition-colors'>
                        <span className='sr-only'>Twitter</span>
                        <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                           <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                        </svg>
                     </a>
                  </div>
               </div>

               {/* Quick Links */}
               <div>
                  <h3 className='text-sm font-semibold text-white tracking-wider uppercase'>Features</h3>
                  <ul className='mt-4 space-y-2'>
                     <li>
                        <Link to='/groups' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Neighbourhood Circles
                        </Link>
                     </li>
                     <li>
                        <Link to='/events' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Local Gatherings
                        </Link>
                     </li>
                     <li>
                        <Link to='/marketplace' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Local Exchange
                        </Link>
                     </li>
                     <li>
                        <Link to='/messages' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Messaging
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Support */}
               <div>
                  <h3 className='text-sm font-semibold text-white tracking-wider uppercase'>Support</h3>
                  <ul className='mt-4 space-y-2'>
                     <li>
                        <Link to='/support' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Help Center
                        </Link>
                     </li>
                     <li>
                        <Link to='/support/community-guidelines' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Community Guidelines
                        </Link>
                     </li>
                     <li>
                        <Link to='/support/privacy-policy' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Privacy Policy
                        </Link>
                     </li>
                     <li>
                        <Link to='/support/terms-of-service' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           Terms of Service
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Contact */}
               <div>
                  <h3 className='text-sm font-semibold text-white tracking-wider uppercase'>Contact</h3>
                  <ul className='mt-4 space-y-2'>
                     <li className='flex items-start'>
                        <svg
                           className='h-5 w-5 text-maple-red mt-0.5 mr-2'
                           xmlns='http://www.w3.org/2000/svg'
                           viewBox='0 0 20 20'
                           fill='currentColor'>
                           <path
                              fillRule='evenodd'
                              d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                              clipRule='evenodd'
                           />
                        </svg>
                        <span className='text-gray-300 text-sm'>123 Maple Street, Toronto, ON M5V 2K4, Canada</span>
                     </li>
                     <li className='flex items-center'>
                        <svg
                           className='h-5 w-5 text-maple-red mr-2'
                           xmlns='http://www.w3.org/2000/svg'
                           viewBox='0 0 20 20'
                           fill='currentColor'>
                           <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                           <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                        </svg>
                        <a
                           href='mailto:mapleconnectsocialapp@gmail.com'
                           className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           mapleconnectsocialapp@gmail.com
                        </a>
                     </li>
                     <li className='flex items-center'>
                        <svg
                           className='h-5 w-5 text-maple-red mr-2'
                           xmlns='http://www.w3.org/2000/svg'
                           viewBox='0 0 20 20'
                           fill='currentColor'>
                           <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                        </svg>
                        <a href='tel:+1-800-MAPLE-CN' className='text-gray-300 hover:text-maple-red transition-colors text-sm'>
                           +1-800-MAPLE-CN
                        </a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className='mt-12 pt-8 border-t border-gray-700'>
               <p className='text-center text-gray-400 text-sm'>&copy; {currentYear} MapleConnect. All rights reserved.</p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
