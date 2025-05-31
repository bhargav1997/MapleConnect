import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { motion } from "framer-motion";

const AdminLogin = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const { adminLogin } = useAdminAuth();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         const success = await adminLogin(email, password);
         if (success) {
            navigate("/admin/verify-otp");
         } else {
            setError("Invalid admin credentials. Please check your email and password.");
         }
      } catch (err) {
         setError("An error occurred. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg'>
            <div>
               <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Admin Login</h2>
               <p className='mt-2 text-center text-sm text-gray-600'>Please enter your admin credentials</p>

               {/* Admin Credentials Info Box */}
               <div className='mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                  <h3 className='text-sm font-semibold text-blue-800 mb-2'>Admin Access Information</h3>
                  <p className='text-sm text-blue-700 mb-2'>Use your admin credentials to access the admin panel:</p>
                  <div className='text-xs text-blue-600'>
                     <p>Admin credentials:</p>
                     <ul className='list-disc list-inside mt-1'>
                        <li>Email: bhargav.suthar@gmail.com</li>
                        <li>Password: Your account password</li>
                        <li>You will receive an OTP after successful login</li>
                     </ul>
                  </div>
               </div>
            </div>

            {error && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-4 text-red-600 bg-red-50 rounded-lg text-sm'>
                  {error}
               </motion.div>
            )}

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
               <div className='rounded-md shadow-sm -space-y-px'>
                  <div>
                     <label htmlFor='email' className='sr-only'>
                        Email
                     </label>
                     <input
                        id='email'
                        name='email'
                        type='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-maple-red focus:border-maple-red focus:z-10 sm:text-sm'
                        placeholder='Admin Email'
                        disabled={loading}
                     />
                  </div>
                  <div>
                     <label htmlFor='password' className='sr-only'>
                        Password
                     </label>
                     <input
                        id='password'
                        name='password'
                        type='password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-maple-red focus:border-maple-red focus:z-10 sm:text-sm'
                        placeholder='Password'
                        disabled={loading}
                     />
                  </div>
               </div>

               <div>
                  <button
                     type='submit'
                     disabled={loading}
                     className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                     }`}>
                     {loading ? (
                        <>
                           <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                              <path
                                 className='opacity-75'
                                 fill='currentColor'
                                 d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              />
                           </svg>
                           Signing in...
                        </>
                     ) : (
                        "Sign in"
                     )}
                  </button>
               </div>
            </form>
         </motion.div>
      </div>
   );
};

export default AdminLogin;
