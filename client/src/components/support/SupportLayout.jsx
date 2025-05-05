import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SupportLayout = ({ children, title, description }) => {
  const location = useLocation();
  
  const supportLinks = [
    { path: '/support', label: 'Support Home' },
    { path: '/support/help-center', label: 'Help Center' },
    { path: '/support/community-guidelines', label: 'Community Guidelines' },
    { path: '/support/privacy-policy', label: 'Privacy Policy' },
    { path: '/support/terms-of-service', label: 'Terms of Service' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{title}</h1>
            {description && (
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{description}</p>
            )}
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full md:w-64 flex-shrink-0"
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Support</h2>
                </div>
                <nav className="py-2">
                  <ul>
                    {supportLinks.map((link) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`block px-4 py-2 text-sm ${
                            isActive(link.path)
                              ? 'bg-maple-red/5 text-maple-red font-medium'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-maple-red'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Need more help?</h2>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Can't find what you're looking for? Contact our support team.
                  </p>
                  <Link
                    to="/contact"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maple-red hover:bg-red-700"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </motion.div>
            
            {/* Main content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 sm:p-8">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportLayout;
