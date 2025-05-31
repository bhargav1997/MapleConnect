import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminLayout = ({ children }) => {
   const location = useLocation();
   const { isAdminAuthenticated, adminLogout } = useAdminAuth();

   if (!isAdminAuthenticated) {
      return <Navigate to='/admin/login' />;
   }

   const navigation = [
      {
         name: "Dashboard",
         path: "/admin",
         icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      },
      {
         name: "Users",
         path: "/admin/users",
         icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      },
      {
         name: "Reported Posts",
         path: "/admin/reported-posts",
         icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      },
      {
         name: "Broadcast",
         path: "/admin/broadcast",
         icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
      },
   ];

   const handleLogout = () => {
      adminLogout();
   };

   return (
      <div className='min-h-screen bg-gray-100'>
         {/* Sidebar */}
         <div className='fixed inset-y-0 left-0 w-64 bg-maple-red text-white transition-transform duration-300 transform'>
            <div className='flex items-center justify-center h-16 bg-maple-red-dark'>
               <span className='text-xl font-semibold'>Admin Dashboard</span>
            </div>
            <nav className='mt-5'>
               {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                     <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                           isActive ? "bg-maple-red-dark" : "hover:bg-maple-red-dark/50"
                        }`}>
                        <svg className='w-5 h-5 mr-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d={item.icon} />
                        </svg>
                        {item.name}
                     </Link>
                  );
               })}

               {/* Logout Button */}
               <button
                  onClick={handleLogout}
                  className='w-full flex items-center px-6 py-3 text-sm font-medium text-white hover:bg-maple-red-dark/50 transition-colors duration-200'>
                  <svg className='w-5 h-5 mr-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                     />
                  </svg>
                  Logout
               </button>
            </nav>
         </div>

         {/* Main Content */}
         <div className='pl-64'>
            <header className='bg-white shadow'>
               <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                  <h1 className='text-2xl font-semibold text-gray-900'>
                     {navigation.find((item) => item.path === location.pathname)?.name || "Admin"}
                  </h1>
               </div>
            </header>
            <main>
               <div className='py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
                  <div className='px-4 py-6 sm:px-0'>{children}</div>
               </div>
            </main>
         </div>
      </div>
   );
};

export default AdminLayout;
