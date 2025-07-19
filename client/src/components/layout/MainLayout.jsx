import React from "react";
import Navbar from "../Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MainLayout = ({ children }) => {
   const location = useLocation();
   const { user: currentUser } = useAuth();

   // Hide footer only for login and register pages
   const hideFooterPaths = [
      "/login",
      "/register",
      "/home",
      "/search",
      "/profile",
      "/groups",
      "/events",
      "/marketplace",
      "/messages",
      "/notifications",
      "/settings",
      "/discover",
      "/admin",
   ];
   const showFooter = !hideFooterPaths.includes(location.pathname) && !currentUser?.id;

   const isAdminRoute = location.pathname.startsWith("/admin");
   return (
      <div className='flex flex-col min-h-screen bg-gray-50'>
         {!isAdminRoute && <Navbar />}
         {!isAdminRoute && <div className='h-16'></div>}
         <main className='flex-grow'>{children}</main>
         {showFooter && <Footer />}
      </div>
   );
};

export default MainLayout;
