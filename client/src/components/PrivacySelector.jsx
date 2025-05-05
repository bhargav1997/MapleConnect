import { motion, AnimatePresence } from "framer-motion";

const PrivacySelector = ({ visibility, setVisibility, onClose }) => {
  const options = [
    {
      id: "public",
      name: "Public",
      description: "Anyone on MapleConnect can see this post",
      icon: (
        <svg className="w-5 h-5 text-maple-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "friends",
      name: "Friends Only",
      description: "Only your friends can see this post",
      icon: (
        <svg className="w-5 h-5 text-maple-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "private",
      name: "Only Me",
      description: "Only you can see this post",
      icon: (
        <svg className="w-5 h-5 text-maple-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
    >
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Who can see your post?</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-2">
        {options.map((option) => (
          <motion.button
            key={option.id}
            type="button"
            onClick={() => {
              setVisibility(option.id);
              onClose();
            }}
            className={`w-full flex items-start p-3 rounded-lg text-left ${
              visibility === option.id ? "bg-maple-red/10" : "hover:bg-gray-50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${visibility === option.id ? "text-maple-red" : "text-gray-700"}`}>
                {option.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PrivacySelector;
