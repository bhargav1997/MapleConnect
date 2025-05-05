import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { likePost, unlikePost, addComment, deleteComment } from '../services/postService';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      const isLiked = post.likes.includes(user.id);
      if (isLiked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setIsSubmitting(true);
      await addComment(post._id, comment);
      setComment('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(post._id, commentId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Post Header */}
      <div className="p-4 flex items-center">
        <Link to={`/profile/${post.user._id}`}>
          <img
            className="h-10 w-10 rounded-full mr-4"
            src={
              post.user.profileImage
                ? `http://localhost:5000/uploads/${post.user.profileImage}`
                : 'https://via.placeholder.com/150'
            }
            alt={post.user.name}
          />
        </Link>
        <div>
          <Link
            to={`/profile/${post.user._id}`}
            className="font-semibold text-gray-900"
          >
            {post.user.name}
          </Link>
          <p className="text-gray-500 text-sm">
            {formatDate(post.createdAt)}
            {post.location && ` • ${post.location}`}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 mb-4">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="w-full">
          {post.media.length === 1 ? (
            <img
              src={`http://localhost:5000/uploads/${post.media[0]}`}
              alt="Post media"
              className="w-full h-auto"
            />
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {post.media.map((media, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/uploads/${media}`}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-auto"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2 border-t border-gray-200">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>{post.likes.length} likes</span>
          <span>{post.comments.length} comments</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200 flex">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-2 ${
            post.likes.includes(user.id)
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill={post.likes.includes(user.id) ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Like
        </button>
        <button
          onClick={() => document.getElementById(`comment-${post._id}`).focus()}
          className="flex-1 flex items-center justify-center py-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Comment
        </button>
      </div>

      {/* Comments Section */}
      <div className="px-4 py-2 border-t border-gray-200">
        {post.comments.length > 0 && (
          <div className="mb-4">
            {post.comments.map((comment) => (
              <div key={comment._id} className="flex items-start mt-3">
                <Link to={`/profile/${comment.user._id}`}>
                  <img
                    className="h-8 w-8 rounded-full mr-3"
                    src={
                      comment.user.profileImage
                        ? `http://localhost:5000/uploads/${comment.user.profileImage}`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={comment.user.name}
                  />
                </Link>
                <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
                  <div className="flex justify-between">
                    <Link
                      to={`/profile/${comment.user._id}`}
                      className="font-semibold text-gray-900"
                    >
                      {comment.user.name}
                    </Link>
                    <span className="text-gray-500 text-xs">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.text}</p>
                </div>
                {(comment.user._id === user.id || post.user._id === user.id) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleComment} className="flex items-center">
          <img
            className="h-8 w-8 rounded-full mr-3"
            src={
              user?.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : 'https://via.placeholder.com/150'
            }
            alt={user?.name}
          />
          <input
            id={`comment-${post._id}`}
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className={`ml-2 px-3 py-1 rounded-full text-sm ${
              isSubmitting || !comment.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
