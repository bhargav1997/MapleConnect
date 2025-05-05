import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { getEventById, updateAttendance, deleteEvent } from '../services/eventService';
import {
  getEventStart,
  getEventSuccess,
  getEventFailure,
  updateAttendanceStart,
  updateAttendanceSuccess,
  updateAttendanceFailure,
  deleteEventStart,
  deleteEventSuccess,
  deleteEventFailure,
} from '../redux/slices/eventSlice';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { event, isLoading, error } = useSelector((state) => state.event);
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        dispatch(getEventStart());
        const response = await getEventById(id);
        dispatch(getEventSuccess(response.data));
      } catch (error) {
        const message =
          error.response && error.response.data.error
            ? error.response.data.error
            : 'Failed to load event';
        dispatch(getEventFailure(message));
      }
    };
    
    fetchEvent();
  }, [dispatch, id]);
  
  const handleAttendance = async (status) => {
    try {
      dispatch(updateAttendanceStart());
      const response = await updateAttendance(id, status);
      dispatch(updateAttendanceSuccess(response.data));
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to update attendance';
      dispatch(updateAttendanceFailure(message));
    }
  };
  
  const handleDeleteEvent = async () => {
    try {
      dispatch(deleteEventStart());
      await deleteEvent(id);
      dispatch(deleteEventSuccess(id));
      navigate('/events');
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to delete event';
      dispatch(deleteEventFailure(message));
      setConfirmDelete(false);
    }
  };
  
  if (isLoading && !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">Event not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const isCreator = event.creator._id === user.id || event.creator === user.id;
  
  // Check if user is attending
  const userAttendance = event.attendees.find(
    (attendee) => attendee.user._id === user.id || attendee.user === user.id
  );
  
  const isGoing = userAttendance && userAttendance.status === 'going';
  const isInterested = userAttendance && userAttendance.status === 'interested';
  const isNotGoing = userAttendance && userAttendance.status === 'not going';
  
  // Format dates
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Check if event is past
  const isPastEvent = new Date(event.endDate) < new Date();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 bg-gray-300 relative">
          {event.image ? (
            <img
              src={`http://localhost:5000/uploads/${event.image}`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {event.isPrivate && (
            <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 bg-opacity-75 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Private Event
            </span>
          )}
          
          {isPastEvent && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="px-4 py-2 bg-white rounded-full text-lg font-medium uppercase">
                Past Event
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600">
                  {formatDate(event.startDate)}
                  {event.startDate !== event.endDate &&
                    ` - ${formatDate(event.endDate)}`}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600">{event.location}</span>
              </div>
              
              {event.group && (
                <div className="flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <Link
                    to={`/groups/${event.group._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {event.group.name}
                  </Link>
                </div>
              )}
              
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-600">
                  Hosted by{' '}
                  <Link
                    to={`/profile/${event.creator._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {event.creator.name}
                  </Link>
                </span>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 md:ml-6 flex flex-col space-y-3">
              {!isPastEvent && (
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleAttendance('going')}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      isGoing
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'text-white bg-green-600 hover:bg-green-700 border-transparent'
                    }`}
                  >
                    {isGoing ? 'Going ✓' : 'Going'}
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('interested')}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      isInterested
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'text-white bg-blue-600 hover:bg-blue-700 border-transparent'
                    }`}
                  >
                    {isInterested ? 'Interested ✓' : 'Interested'}
                  </button>
                  
                  <button
                    onClick={() => handleAttendance('not going')}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                      isNotGoing
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
                    }`}
                  >
                    {isNotGoing ? 'Not Going ✓' : 'Not Going'}
                  </button>
                </div>
              )}
              
              {isCreator && (
                <div className="relative">
                  <button
                    onClick={() => setConfirmDelete(!confirmDelete)}
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    Delete Event
                  </button>
                  
                  {confirmDelete && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <p className="px-4 py-2 text-sm text-gray-700">
                          Are you sure?
                        </p>
                        <button
                          onClick={handleDeleteEvent}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                        >
                          Yes, delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About this event
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendees</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Going ({event.attendees.filter((a) => a.status === 'going').length})
                </h3>
                {event.attendees.filter((a) => a.status === 'going').length === 0 ? (
                  <p className="text-gray-500">No one is going yet</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {event.attendees
                      .filter((attendee) => attendee.status === 'going')
                      .map((attendee) => (
                        <Link
                          key={attendee.user._id || attendee.user}
                          to={`/profile/${attendee.user._id || attendee.user}`}
                          className="flex flex-col items-center"
                        >
                          <img
                            className="h-12 w-12 rounded-full"
                            src={
                              attendee.user.profileImage
                                ? `http://localhost:5000/uploads/${attendee.user.profileImage}`
                                : 'https://via.placeholder.com/150'
                            }
                            alt={attendee.user.name}
                          />
                          <span className="text-xs text-gray-700 mt-1">
                            {attendee.user.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Interested (
                  {event.attendees.filter((a) => a.status === 'interested').length})
                </h3>
                {event.attendees.filter((a) => a.status === 'interested').length ===
                0 ? (
                  <p className="text-gray-500">No one is interested yet</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {event.attendees
                      .filter((attendee) => attendee.status === 'interested')
                      .map((attendee) => (
                        <Link
                          key={attendee.user._id || attendee.user}
                          to={`/profile/${attendee.user._id || attendee.user}`}
                          className="flex flex-col items-center"
                        >
                          <img
                            className="h-12 w-12 rounded-full"
                            src={
                              attendee.user.profileImage
                                ? `http://localhost:5000/uploads/${attendee.user.profileImage}`
                                : 'https://via.placeholder.com/150'
                            }
                            alt={attendee.user.name}
                          />
                          <span className="text-xs text-gray-700 mt-1">
                            {attendee.user.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
