import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotificationsStart,
  getNotificationsSuccess,
  getNotificationsFailure,
  markAllAsReadStart,
  markAllAsReadSuccess,
  markAllAsReadFailure,
  deleteAllNotificationsStart,
  deleteAllNotificationsSuccess,
  deleteAllNotificationsFailure
} from '../redux/slices/notificationSlice';
import {
  getNotifications,
  markAllAsRead,
  deleteAllNotifications
} from '../services/notificationService';
import NotificationItem from '../components/notifications/NotificationItem';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, isLoading, error } = useSelector(
    (state) => state.notification
  );
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        dispatch(getNotificationsStart());
        const response = await getNotifications(1, 50); // Get more notifications for the full page
        dispatch(getNotificationsSuccess(response.data));
      } catch (error) {
        const message =
          error.response && error.response.data.error
            ? error.response.data.error
            : 'Failed to load notifications';
        dispatch(getNotificationsFailure(message));
      }
    };
    
    fetchNotifications();
  }, [dispatch]);
  
  const handleMarkAllAsRead = async () => {
    try {
      dispatch(markAllAsReadStart());
      await markAllAsRead();
      dispatch(markAllAsReadSuccess());
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to mark all as read';
      dispatch(markAllAsReadFailure(message));
    }
  };
  
  const handleClearAll = async () => {
    try {
      dispatch(deleteAllNotificationsStart());
      await deleteAllNotifications();
      dispatch(deleteAllNotificationsSuccess());
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to clear notifications';
      dispatch(deleteAllNotificationsFailure(message));
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <div className="flex space-x-4">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading && notifications.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="px-4 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any notifications at the moment.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification._id}>
                <NotificationItem notification={notification} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
