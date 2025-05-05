import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
   const { isAuthenticated, isLoading } = useAuth();

   if (isLoading) {
      return (
         <div className='flex justify-center items-center min-h-screen'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
         </div>
      );
   }

   return isAuthenticated ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
