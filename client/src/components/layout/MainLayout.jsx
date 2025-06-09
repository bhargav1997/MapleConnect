import React from "react";
import Navbar from "../Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
   const location = useLocation();

   // Hide footer only for login and register pages
   const hideFooterPaths = ["/login", "/register"];
   const showFooter = !hideFooterPaths.includes(location.pathname);

   return (
      <div className='flex flex-col min-h-screen bg-gray-50'>
         <Navbar />
         {/* Spacer to prevent content from being hidden behind fixed navbar */}
         <div className='h-16'></div>
         <main className='flex-grow'>{children}</main>
         {showFooter && <Footer />}
      </div>
   );
};

export default MainLayout;
