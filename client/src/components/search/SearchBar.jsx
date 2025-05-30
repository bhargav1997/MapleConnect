import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SearchBar = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [results, setResults] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [showResults, setShowResults] = useState(false);
   const searchRef = useRef(null);
   const navigate = useNavigate();

   useEffect(() => {
      // Add event listener to close dropdown when clicking outside
      const handleClickOutside = (event) => {
         if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowResults(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
         if (searchTerm.trim().length >= 2) {
            performSearch();
         } else {
            setResults([]);
         }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
   }, [searchTerm]);

   const performSearch = async () => {
      setIsLoading(true);
      try {
         // Search users
         const usersResponse = await api.get(`/api/users?search=${searchTerm}`);

         // Search posts
         const postsResponse = await api.get(`/api/posts?search=${searchTerm}`);

         // Search groups
         const groupsResponse = await api.get(`/api/groups?search=${searchTerm}`);

         // Search events
         const eventsResponse = await api.get(`/api/events?search=${searchTerm}`);

         // Combine results
         const combinedResults = [
            ...usersResponse.data.data.map((user) => ({
               type: "user",
               id: user._id,
               title: user.name,
               image: user.profileImage,
               url: `/profile/${user._id}`,
            })),
            ...postsResponse.data.data.map((post) => ({
               type: "post",
               id: post._id,
               title: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
               image: post.image,
               url: `/posts/${post._id}`,
            })),
            ...groupsResponse.data.data.map((group) => ({
               type: "group",
               id: group._id,
               title: group.name,
               image: group.image,
               url: `/groups/${group._id}`,
            })),
            ...eventsResponse.data.data.map((event) => ({
               type: "event",
               id: event._id,
               title: event.title,
               image: event.image,
               url: `/events/${event._id}`,
            })),
         ];

         setResults(combinedResults.slice(0, 5)); // Limit to 5 results
         setShowResults(true);
      } catch (error) {
         console.error("Search error:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
         navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
         setShowResults(false);
      }
   };

   const handleResultClick = (url) => {
      navigate(url);
      setSearchTerm("");
      setShowResults(false);
   };

   return (
      <div className='relative flex-1 max-w-xs sm:max-w-md' ref={searchRef}>
         <form onSubmit={handleSearch}>
            <div className='relative'>
               <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                     className='h-5 w-5 text-gray-400'
                     xmlns='http://www.w3.org/2000/svg'
                     viewBox='0 0 20 20'
                     fill='currentColor'
                     aria-hidden='true'>
                     <path
                        fillRule='evenodd'
                        d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        clipRule='evenodd'
                     />
                  </svg>
               </div>
               <input
                  type='text'
                  name='search'
                  id='search'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  placeholder='Search'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                     if (results.length > 0) {
                        setShowResults(true);
                     }
                  }}
               />
               {isLoading && (
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                     <svg className='animate-spin h-5 w-5 text-gray-400' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path
                           className='opacity-75'
                           fill='currentColor'
                           d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                     </svg>
                  </div>
               )}
            </div>
         </form>

         {/* Search Results Dropdown */}
         {showResults && results.length > 0 && (
            <div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-sm'>
               {results.map((result) => (
                  <div
                     key={`${result.type}-${result.id}`}
                     className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
                     onClick={() => handleResultClick(result.url)}>
                     <div className='flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-3'>
                        {result.image ? (
                           <img src={`${result.image}`} alt={result.title} className='h-full w-full object-cover' />
                        ) : (
                           <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500'>
                              {result.type === "user" && (
                                 <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                                    <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                                 </svg>
                              )}
                              {result.type === "post" && (
                                 <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                                    <path
                                       fillRule='evenodd'
                                       d='M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z'
                                       clipRule='evenodd'
                                    />
                                    <path d='M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z' />
                                 </svg>
                              )}
                              {result.type === "group" && (
                                 <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                                    <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                                 </svg>
                              )}
                              {result.type === "event" && (
                                 <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                                    <path
                                       fillRule='evenodd'
                                       d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                              )}
                           </div>
                        )}
                     </div>
                     <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-gray-900 truncate'>{result.title}</p>
                        <p className='text-xs text-gray-500 capitalize'>{result.type}</p>
                     </div>
                  </div>
               ))}
               <div className='px-4 py-2 border-t border-gray-100'>
                  <button onClick={handleSearch} className='text-sm text-indigo-600 hover:text-indigo-800 font-medium'>
                     View all results
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default SearchBar;
