import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { getGroupById, joinGroup, leaveGroup, deleteGroup } from "../services/groupService";
import { getGroupEvents } from "../services/eventService";
import {
   getGroupStart,
   getGroupSuccess,
   getGroupFailure,
   joinGroupStart,
   joinGroupSuccess,
   joinGroupFailure,
   leaveGroupStart,
   leaveGroupSuccess,
   leaveGroupFailure,
   deleteGroupStart,
   deleteGroupSuccess,
   deleteGroupFailure,
} from "../redux/slices/groupSlice";
import EventCard from "../components/events/EventCard";
import CreateEventForm from "../components/events/CreateEventForm";
import EditGroupForm from "../components/groups/EditGroupForm";
import defaultCoverImage from "../assets/default-cover.png";
import defaultUserImage from "../assets/default-user.png";

const GroupDetail = () => {
   const { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useAuth();
   const { group, isLoading, error } = useSelector((state) => state.group);

   const [activeTab, setActiveTab] = useState("about");
   const [events, setEvents] = useState([]);
   const [eventsLoading, setEventsLoading] = useState(false);
   const [eventsError, setEventsError] = useState(null);
   const [showCreateEventForm, setShowCreateEventForm] = useState(false);
   const [showEditGroupForm, setShowEditGroupForm] = useState(false);
   const [confirmDelete, setConfirmDelete] = useState(false);

   useEffect(() => {
      const fetchGroup = async () => {
         try {
            dispatch(getGroupStart());
            const response = await getGroupById(id);
            dispatch(getGroupSuccess(response.data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load group";
            dispatch(getGroupFailure(message));
         }
      };

      fetchGroup();
   }, [dispatch, id]);

   useEffect(() => {
      if (activeTab === "events") {
         const fetchEvents = async () => {
            try {
               setEventsLoading(true);
               const response = await getGroupEvents(id);
               setEvents(response.data);
               setEventsError(null);
            } catch (error) {
               const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load events";
               setEventsError(message);
            } finally {
               setEventsLoading(false);
            }
         };

         fetchEvents();
      }
   }, [activeTab, id]);

   const handleJoinGroup = async () => {
      try {
         dispatch(joinGroupStart());
         const response = await joinGroup(id);
         dispatch(joinGroupSuccess(response.data));
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to join group";
         dispatch(joinGroupFailure(message));
      }
   };

   const handleLeaveGroup = async () => {
      try {
         dispatch(leaveGroupStart());
         const response = await leaveGroup(id);
         dispatch(leaveGroupSuccess(response.data));
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to leave group";
         dispatch(leaveGroupFailure(message));
      }
   };

   const handleDeleteGroup = async () => {
      try {
         dispatch(deleteGroupStart());
         await deleteGroup(id);
         dispatch(deleteGroupSuccess(id));
         navigate("/groups");
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to delete group";
         dispatch(deleteGroupFailure(message));
         setConfirmDelete(false);
      }
   };

   if (isLoading && !group) {
      return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex justify-center items-center py-20'>
               <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maple-red'></div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-red-50 border-l-4 border-red-400 p-4 my-6'>
               <div className='flex'>
                  <div className='flex-shrink-0'>
                     <svg className='h-5 w-5 text-red-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                           clipRule='evenodd'
                        />
                     </svg>
                  </div>
                  <div className='ml-3'>
                     <p className='text-sm text-red-700'>{error}</p>
                     <button onClick={() => window.location.reload()} className='mt-2 text-sm text-indigo-600 hover:text-indigo-500'>
                        Try again
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (!group) {
      return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center py-10'>
               <h3 className='text-lg font-medium text-gray-900'>Group not found</h3>
               <p className='mt-1 text-sm text-gray-500'>The group you're looking for doesn't exist or has been removed.</p>
               <div className='mt-6'>
                  <Link
                     to='/groups'
                     className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                     Back to Groups
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   const isMember = group.members.some((member) => member._id === user.id || member === user.id);
   const isAdmin = group.admins.some((admin) => admin._id === user.id || admin === user.id);
   const isCreator = group.creator._id === user.id || group.creator === user.id;

   return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
         {/* Group Header */}
         <div className='bg-white rounded-lg shadow-md overflow-hidden mb-6'>
            <div className='h-48 bg-gray-300 relative'>
               <img
                  src={group.coverImage ? `${group.coverImage}` : defaultCoverImage}
                  alt={group.name}
                  className='w-full h-full object-cover'
               />
            </div>

            <div className='px-4 py-5 sm:px-6'>
               <div className='flex flex-col md:flex-row md:items-center'>
                  <div className='flex-shrink-0 -mt-16 md:mr-6 relative'>
                     <div className='h-24 w-24 rounded-full overflow-hidden border-4 border-white bg-gray-200 relative'>
                        <img
                           src={group.image ? `${group.image}` : defaultUserImage}
                           alt={group.name}
                           className='h-full w-full object-cover'
                        />

                        {isCreator && (
                           <button
                              onClick={() => setShowEditGroupForm(true)}
                              className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-all duration-200 rounded-full overflow-hidden'>
                              <svg className='w-8 h-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                                 />
                              </svg>
                           </button>
                        )}
                     </div>
                  </div>

                  <div className='mt-4 md:mt-0 flex-1'>
                     <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                        <div>
                           <h1 className='text-2xl font-bold text-gray-900'>{group.name}</h1>
                           <p className='text-sm text-gray-500'>
                              {group.members.length} {group.members.length === 1 ? "member" : "members"}
                              {group.location && ` • ${group.location}`}
                              {group.isPrivate && (
                                 <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                                    <svg
                                       xmlns='http://www.w3.org/2000/svg'
                                       className='h-3 w-3 mr-1'
                                       fill='none'
                                       viewBox='0 0 24 24'
                                       stroke='currentColor'>
                                       <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                       />
                                    </svg>
                                    Private
                                 </span>
                              )}
                           </p>
                        </div>

                        <div className='mt-4 md:mt-0 flex flex-col sm:flex-row sm:space-x-3'>
                           {isMember ? (
                              <button
                                 onClick={handleLeaveGroup}
                                 className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                                 Leave Group
                              </button>
                           ) : (
                              <button
                                 onClick={handleJoinGroup}
                                 className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                                 Join Group
                              </button>
                           )}

                           {isCreator && (
                              <div className='relative mt-3 sm:mt-0'>
                                 <button
                                    onClick={() => setConfirmDelete(!confirmDelete)}
                                    className='inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                                    Delete Group
                                 </button>

                                 {confirmDelete && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
                                       <div className='py-1'>
                                          <p className='px-4 py-2 text-sm text-gray-700'>Are you sure?</p>
                                          <button
                                             onClick={handleDeleteGroup}
                                             className='block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100'>
                                             Yes, delete
                                          </button>
                                          <button
                                             onClick={() => setConfirmDelete(false)}
                                             className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                             Cancel
                                          </button>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Group Tabs */}
            <div className='border-t border-gray-200'>
               <div className='flex overflow-x-auto'>
                  <button
                     onClick={() => setActiveTab("about")}
                     className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                        activeTab === "about"
                           ? "text-maple-red border-b-2 border-maple-red"
                           : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                     }`}>
                     About
                  </button>
                  <button
                     onClick={() => setActiveTab("events")}
                     className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                        activeTab === "events"
                           ? "text-maple-red border-b-2 border-maple-red"
                           : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                     }`}>
                     Events
                  </button>
                  <button
                     onClick={() => setActiveTab("members")}
                     className={`flex-1 py-4 px-1 text-center font-medium text-sm ${
                        activeTab === "members"
                           ? "text-maple-red border-b-2 border-maple-red"
                           : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                     }`}>
                     Members
                  </button>
               </div>
            </div>
         </div>

         {/* Edit Group Form Modal */}
         {showEditGroupForm && (
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4'>
               <div className='max-w-2xl w-full'>
                  <EditGroupForm group={group} onClose={() => setShowEditGroupForm(false)} />
               </div>
            </div>
         )}

         {/* Group Content */}
         <div className='bg-white rounded-lg shadow-md p-6'>
            {activeTab === "about" && (
               <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4'>About</h2>
                  <p className='text-gray-700 whitespace-pre-line'>{group.description}</p>

                  <div className='mt-6'>
                     <h3 className='text-lg font-medium text-gray-900 mb-2'>Group Info</h3>
                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                           <h4 className='text-sm font-medium text-gray-500'>Created by</h4>
                           <div className='mt-1 flex items-center'>
                              <Link to={`/profile/${group.creator._id}`} className='flex items-center'>
                                 <img
                                    className='h-8 w-8 rounded-full mr-2'
                                    src={
                                       group.creator.profileImage
                                          ? `${group.creator.profileImage}`
                                          : defaultUserImage
                                    }
                                    alt={group.creator.name}
                                 />
                                 <span className='text-sm font-medium text-gray-900'>{group.creator.name}</span>
                              </Link>
                           </div>
                        </div>

                        <div>
                           <h4 className='text-sm font-medium text-gray-500'>Created on</h4>
                           <p className='mt-1 text-sm text-gray-900'>{new Date(group.createdAt).toLocaleDateString()}</p>
                        </div>

                        {group.location && (
                           <div>
                              <h4 className='text-sm font-medium text-gray-500'>Location</h4>
                              <p className='mt-1 text-sm text-gray-900'>{group.location}</p>
                           </div>
                        )}

                        <div>
                           <h4 className='text-sm font-medium text-gray-500'>Privacy</h4>
                           <p className='mt-1 text-sm text-gray-900'>{group.isPrivate ? "Private group" : "Public group"}</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === "events" && (
               <div>
                  <div className='flex justify-between items-center mb-6'>
                     <h2 className='text-xl font-semibold text-gray-900'>Events</h2>
                     {isMember && (
                        <button
                           onClick={() => setShowCreateEventForm(true)}
                           className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                           <svg
                              className='-ml-1 mr-2 h-4 w-4'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                              aria-hidden='true'>
                              <path
                                 fillRule='evenodd'
                                 d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                                 clipRule='evenodd'
                              />
                           </svg>
                           Create Event
                        </button>
                     )}
                  </div>

                  {/* Create Event Form Modal */}
                  {showCreateEventForm && (
                     <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4'>
                        <div className='max-w-2xl w-full'>
                           <CreateEventForm onClose={() => setShowCreateEventForm(false)} groupId={id} />
                        </div>
                     </div>
                  )}

                  {eventsLoading ? (
                     <div className='flex justify-center items-center py-10'>
                        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-maple-red'></div>
                     </div>
                  ) : eventsError ? (
                     <div className='bg-red-50 border-l-4 border-red-400 p-4 my-6'>
                        <div className='flex'>
                           <div className='flex-shrink-0'>
                              <svg
                                 className='h-5 w-5 text-red-400'
                                 xmlns='http://www.w3.org/2000/svg'
                                 viewBox='0 0 20 20'
                                 fill='currentColor'>
                                 <path
                                    fillRule='evenodd'
                                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                    clipRule='evenodd'
                                 />
                              </svg>
                           </div>
                           <div className='ml-3'>
                              <p className='text-sm text-red-700'>{eventsError}</p>
                              <button onClick={() => setActiveTab("events")} className='mt-2 text-sm text-indigo-600 hover:text-indigo-500'>
                                 Try again
                              </button>
                           </div>
                        </div>
                     </div>
                  ) : events.length === 0 ? (
                     <div className='text-center py-10'>
                        <svg
                           className='mx-auto h-12 w-12 text-gray-400'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'
                           aria-hidden='true'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                           />
                        </svg>
                        <h3 className='mt-2 text-sm font-medium text-gray-900'>No events yet</h3>
                        <p className='mt-1 text-sm text-gray-500'>
                           {isMember ? "Get started by creating a new event." : "This group has no upcoming events."}
                        </p>
                        {isMember && (
                           <div className='mt-6'>
                              <button
                                 onClick={() => setShowCreateEventForm(true)}
                                 className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                                 <svg
                                    className='-ml-1 mr-2 h-5 w-5'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                    fill='currentColor'
                                    aria-hidden='true'>
                                    <path
                                       fillRule='evenodd'
                                       d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                                 Create Event
                              </button>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {events?.map((event) => (
                           <EventCard key={event._id} event={event} />
                        ))}
                     </div>
                  )}
               </div>
            )}

            {activeTab === "members" && (
               <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-6'>Members</h2>

                  <div className='space-y-6'>
                     <div>
                        <h3 className='text-lg font-medium text-gray-900 mb-3'>Admins ({group.admins.length})</h3>
                        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                           {group.admins.map((admin) => (
                              <li key={admin._id || admin} className='flex items-center p-3 bg-gray-50 rounded-lg'>
                                 <Link to={`/profile/${admin._id || admin}`} className='flex items-center flex-1'>
                                    <img
                                       className='h-10 w-10 rounded-full mr-3'
                                       src={admin.profileImage ? `${admin.profileImage}` : defaultUserImage}
                                       alt={admin.name}
                                    />
                                    <div>
                                       <p className='text-sm font-medium text-gray-900'>{admin.name}</p>
                                       {admin._id === group.creator._id && <p className='text-xs text-gray-500'>Creator</p>}
                                    </div>
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div>
                        <h3 className='text-lg font-medium text-gray-900 mb-3'>All Members ({group.members.length})</h3>
                        <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                           {group.members.map((member) => (
                              <li key={member._id || member} className='flex items-center p-3 bg-gray-50 rounded-lg'>
                                 <Link to={`/profile/${member._id || member}`} className='flex items-center flex-1'>
                                    <img
                                       className='h-10 w-10 rounded-full mr-3'
                                       src={member.profileImage ? `${member.profileImage}` : defaultUserImage}
                                       alt={member.name}
                                    />
                                    <div>
                                       <p className='text-sm font-medium text-gray-900'>{member.name}</p>
                                       {group.admins.some((admin) => (admin._id || admin) === (member._id || member)) && (
                                          <p className='text-xs text-gray-500'>Admin</p>
                                       )}
                                    </div>
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default GroupDetail;
