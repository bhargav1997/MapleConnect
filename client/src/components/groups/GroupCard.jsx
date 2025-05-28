import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import defaultCoverImage from "../../assets/default-cover.png";
import defaultUserImage from "../../assets/default-user.png";

const GroupCard = ({ group }) => {
   const { user } = useAuth();
   const isMember = group.members.includes(user?.id);

   return (
      <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200 group'>
         <div className='h-40 bg-gray-200 relative'>
            <img
               src={group.coverImage ? group.coverImage : defaultUserImage}
               alt={group.name}
               className='w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-200 z-0'
               style={{ zIndex: 0 }}
            />
            <div
               className='h-16 w-16 rounded-full overflow-hidden border-4 border-white bg-gray-200 shadow-md absolute left-6 -bottom-8 z-20 group-focus:z-20 group-hover:z-20'
               style={{ zIndex: 20 }}
               tabIndex={0}>
               <img src={group.image ? group.image : defaultCoverImage} alt={group.name} className='h-full w-full object-cover' />
            </div>
         </div>

         <div className='p-5 pt-10'>
            <div className='flex items-start mb-4'>
               <div className='pt-1'>
                  <h3 className='text-xl font-bold text-charcoal-gray'>{group.name}</h3>
                  <div className='flex items-center text-sm text-gray-500 mt-1'>
                     <svg className='h-4 w-4 text-maple-red/70 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                     </svg>
                     <span>
                        {group.members.length} {group.members.length === 1 ? "member" : "members"}
                     </span>

                     {group.location && (
                        <>
                           <span className='mx-1'>•</span>
                           <svg className='h-4 w-4 text-maple-red/70 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                              <path
                                 fillRule='evenodd'
                                 d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                                 clipRule='evenodd'
                              />
                           </svg>
                           <span>{group.location}</span>
                        </>
                     )}
                  </div>
               </div>
            </div>

            <p className='text-gray-600 mb-5 line-clamp-3 text-sm'>{group.description}</p>

            <div className='flex justify-between items-center pt-2 border-t border-gray-100'>
               <div className='flex items-center'>
                  {isMember && (
                     <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        <svg className='h-3 w-3 mr-1 text-green-500' fill='currentColor' viewBox='0 0 20 20'>
                           <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                           />
                        </svg>
                        Member
                     </span>
                  )}
               </div>

               <div>
                  <Link
                     to={`/groups/${group._id}`}
                     className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark shadow-sm transition-all duration-200'>
                     View Circle
                     <svg className='ml-1 h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                     </svg>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default GroupCard;
