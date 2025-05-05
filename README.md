# MapleConnect

MapleConnect is a community-centric social media platform that celebrates Canadian localism. The platform aims to foster connections among local residents, businesses, and organizations by providing features that encourage sharing, collaboration, and community engagement.

## Features

- User Authentication: Secure sign-up and login using JWT
- User Profiles: Personal profiles with bio, photo, and activity feed
- Posts: Share text, images, or videos with the community
- Comments & Likes: Engage with posts through comments and reactions
- Groups: Join or create interest-based local groups
- Events: Create and RSVP to local events
- Marketplace: Buy and sell items within the community
- Direct Messaging: Private conversations between users
- Notifications: Real-time updates on interactions and events
- Search Functionality: Search for users, groups, and posts

## Tech Stack

### Frontend
- React.js
- Redux for state management
- React Router for navigation
- Tailwind CSS for styling
- Formik and Yup for form validation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/mapleconnect.git
cd mapleconnect
```

2. Install dependencies for the server
```
cd server
npm install
```

3. Install dependencies for the client
```
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

5. Start the development server
```
# In the server directory
npm run dev

# In the client directory
npm run dev
```

6. Open your browser and navigate to http://localhost:5173

## Project Structure

```
MapleConnect/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/                # Source files
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── services/       # API calls
│       ├── context/        # React Contexts
│       ├── redux/          # Redux store and slices
│       ├── App.js          # Main App component
│       └── index.js        # Entry point
├── server/                 # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Entry point
├── .env                    # Environment variables
├── package.json            # Project metadata
└── README.md               # Project overview
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux](https://redux.js.org/)
