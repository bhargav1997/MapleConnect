import { useState, useEffect } from "react";
import { getAdminStats } from "../../services/adminService";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Dashboard = () => {
   const [stats, setStats] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const response = await getAdminStats();
            setStats(response.data);
         } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch statistics");
         } finally {
            setLoading(false);
         }
      };

      fetchStats();
   }, []);

   if (loading) {
      return (
         <div className='flex items-center justify-center h-96'>
            <div className='w-16 h-16 border-4 border-maple-red border-t-transparent rounded-full animate-spin'></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='p-4 text-red-600 bg-red-50 rounded-lg'>
            <p>{error}</p>
         </div>
      );
   }

   const statCards = [
      {
         title: "Total Users",
         value: stats?.totalUsers || 0,
         icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
         color: "bg-blue-500",
      },
      {
         title: "Total Posts",
         value: stats?.totalPosts || 0,
         icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
         color: "bg-green-500",
      },
      {
         title: "Reported Posts",
         value: stats?.reportedPosts || 0,
         icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
         color: "bg-red-500",
      },
   ];

   return (
      <div className='space-y-6'>
         {/* Stats Grid */}
         <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {statCards.map((stat, index) => (
               <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='p-6 bg-white rounded-lg shadow-sm'>
                  <div className='flex items-center'>
                     <div className={`p-3 rounded-full ${stat.color}`}>
                        <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={stat.icon} />
                        </svg>
                     </div>
                     <div className='ml-4'>
                        <p className='text-sm font-medium text-gray-600'>{stat.title}</p>
                        <p className='text-2xl font-semibold text-gray-900'>{stat.value}</p>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         {/* Recent Users */}
         <div className='bg-white rounded-lg shadow-sm'>
            <div className='px-6 py-5 border-b border-gray-200'>
               <h3 className='text-lg font-medium text-gray-900'>Recent Users</h3>
            </div>
            <div className='divide-y divide-gray-200'>
               {stats?.recentUsers?.map((user, index) => (
                  <motion.div
                     key={user._id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className='px-6 py-4'>
                     <div className='flex items-center justify-between'>
                        <div>
                           <p className='text-sm font-medium text-gray-900'>{user.name}</p>
                           <p className='text-sm text-gray-500'>@{user.username}</p>
                        </div>
                        <p className='text-sm text-gray-500'>{format(new Date(user.createdAt), "MMM d, yyyy")}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
