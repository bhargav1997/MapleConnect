import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    groups: [],
    events: [],
    marketplace: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Search users
        const usersResponse = await api.get(`/api/users?search=${query}`);
        
        // Search posts
        const postsResponse = await api.get(`/api/posts?search=${query}`);
        
        // Search groups
        const groupsResponse = await api.get(`/api/groups?search=${query}`);
        
        // Search events
        const eventsResponse = await api.get(`/api/events?search=${query}`);
        
        // Search marketplace
        const marketplaceResponse = await api.get(`/api/marketplace?search=${query}`);
        
        setResults({
          users: usersResponse.data.data,
          posts: postsResponse.data.data,
          groups: groupsResponse.data.data,
          events: eventsResponse.data.data,
          marketplace: marketplaceResponse.data.data
        });
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchResults();
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const getTotalResults = () => {
    return (
      results.users.length +
      results.posts.length +
      results.groups.length +
      results.events.length +
      results.marketplace.length
    );
  };

  const getFilteredResults = () => {
    if (activeTab === 'all') {
      return [
        ...results.users.map(item => ({ ...item, type: 'user' })),
        ...results.posts.map(item => ({ ...item, type: 'post' })),
        ...results.groups.map(item => ({ ...item, type: 'group' })),
        ...results.events.map(item => ({ ...item, type: 'event' })),
        ...results.marketplace.map(item => ({ ...item, type: 'marketplace' }))
      ];
    }
    
    return results[activeTab].map(item => ({ ...item, type: activeTab }));
  };

  const renderResultItem = (item) => {
    switch (item.type) {
      case 'user':
        return (
          <Link
            to={`/profile/${item._id}`}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                {item.profileImage ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.profileImage}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.bio ? item.bio.substring(0, 100) + (item.bio.length > 100 ? '...' : '') : 'No bio'}
                </p>
              </div>
            </div>
          </Link>
        );
        
      case 'post':
        return (
          <Link
            to={`/posts/${item._id}`}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex">
              {item.image && (
                <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-200 mr-4">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt="Post"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                    {item.author?.profileImage ? (
                      <img
                        src={`http://localhost:5000/uploads/${item.author.profileImage}`}
                        alt={item.author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-indigo-100"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.author?.name || 'Unknown User'}
                  </span>
                </div>
                <p className="text-gray-700">
                  {item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '')}
                </p>
              </div>
            </div>
          </Link>
        );
        
      case 'group':
        return (
          <Link
            to={`/groups/${item._id}`}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                {item.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.members?.length || 0} members
                  {item.location && ` • ${item.location}`}
                </p>
              </div>
            </div>
          </Link>
        );
        
      case 'event':
        return (
          <Link
            to={`/events/${item._id}`}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex">
              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-200 mr-4">
                {item.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(item.startDate).toLocaleDateString()} • {item.location}
                </p>
              </div>
            </div>
          </Link>
        );
        
      case 'marketplace':
        return (
          <Link
            to={`/marketplace/${item._id}`}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex">
              <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-200 mr-4">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.images[0]}`}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm font-bold text-indigo-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        {!isLoading && (
          <p className="text-gray-500 mt-2">
            {getTotalResults()} results found
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            People ({results.users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`${
              activeTab === 'posts'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Posts ({results.posts.length})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`${
              activeTab === 'groups'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Groups ({results.groups.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`${
              activeTab === 'events'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Events ({results.events.length})
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`${
              activeTab === 'marketplace'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Marketplace ({results.marketplace.length})
          </button>
        </nav>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
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
            </div>
          </div>
        </div>
      ) : getTotalResults() === 0 ? (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find anything matching your search. Try different keywords or
            filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {getFilteredResults().map((item) => (
            <div key={`${item.type}-${item._id}`}>
              {renderResultItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
