import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import {
  getListingById,
  updateStatus,
  deleteListing,
} from '../services/marketplaceService';
import {
  getListingStart,
  getListingSuccess,
  getListingFailure,
  updateStatusStart,
  updateStatusSuccess,
  updateStatusFailure,
  deleteListingStart,
  deleteListingSuccess,
  deleteListingFailure,
} from '../redux/slices/marketplaceSlice';

const ListingDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listing, isLoading, error } = useSelector((state) => state.marketplace);
  
  const [activeImage, setActiveImage] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        dispatch(getListingStart());
        const response = await getListingById(id);
        dispatch(getListingSuccess(response.data));
      } catch (error) {
        const message =
          error.response && error.response.data.error
            ? error.response.data.error
            : 'Failed to load listing';
        dispatch(getListingFailure(message));
      }
    };
    
    fetchListing();
  }, [dispatch, id]);
  
  const handleStatusChange = async (status) => {
    try {
      dispatch(updateStatusStart());
      const response = await updateStatus(id, status);
      dispatch(updateStatusSuccess(response.data));
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to update status';
      dispatch(updateStatusFailure(message));
    }
  };
  
  const handleDeleteListing = async () => {
    try {
      dispatch(deleteListingStart());
      await deleteListing(id);
      dispatch(deleteListingSuccess(id));
      navigate('/marketplace');
    } catch (error) {
      const message =
        error.response && error.response.data.error
          ? error.response.data.error
          : 'Failed to delete listing';
      dispatch(deleteListingFailure(message));
      setConfirmDelete(false);
    }
  };
  
  if (isLoading && !listing) {
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
  
  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-900">Listing not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/marketplace"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const isOwner = listing.seller._id === user.id || listing.seller === user.id;
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-96 bg-gray-200">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${listing.images[activeImage]}`}
                  alt={listing.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              )}
              
              {listing.status !== 'available' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium uppercase">
                    {listing.status === 'pending' ? 'Pending' : 'Sold'}
                  </span>
                </div>
              )}
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="flex overflow-x-auto p-2 space-x-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${
                      activeImage === index
                        ? 'border-indigo-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Listing Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {listing.title}
              </h1>
              <span className="text-2xl font-bold text-indigo-600">
                {formatPrice(listing.price)}
              </span>
            </div>
            
            <div className="flex items-center mb-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  listing.condition === 'New'
                    ? 'bg-green-100 text-green-800'
                    : listing.condition === 'Like New'
                    ? 'bg-blue-100 text-blue-800'
                    : listing.condition === 'Good'
                    ? 'bg-yellow-100 text-yellow-800'
                    : listing.condition === 'Fair'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {listing.condition}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{listing.category}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                Listed {formatDate(listing.createdAt)}
              </span>
            </div>
            
            <div className="flex items-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-1.5"
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
              <span className="text-gray-600">{listing.location}</span>
              
              {listing.isDeliveryAvailable && (
                <>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-green-600">Delivery available</span>
                </>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.description}
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Seller</h2>
              <div className="flex items-center">
                <Link to={`/profile/${listing.seller._id}`}>
                  <img
                    className="h-10 w-10 rounded-full mr-4"
                    src={
                      listing.seller.profileImage
                        ? `http://localhost:5000/uploads/${listing.seller.profileImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={listing.seller.name}
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${listing.seller._id}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {listing.seller.name}
                  </Link>
                </div>
              </div>
            </div>
            
            {isOwner ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="mr-3 text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <select
                    value={listing.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setConfirmDelete(!confirmDelete)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    Delete Listing
                  </button>
                  
                  {confirmDelete && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <p className="px-4 py-2 text-sm text-gray-700">
                          Are you sure?
                        </p>
                        <button
                          onClick={handleDeleteListing}
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
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showContactInfo ? 'Hide Contact Info' : 'Contact Seller'}
                </button>
                
                {showContactInfo && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      To contact the seller, send them a message:
                    </p>
                    <Link
                      to={`/messages/${listing.seller._id}`}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Send Message
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
