import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
   likePost,
   unlikePost,
   commentOnPost,
   deleteComment,
   deletePost,
   reportPost,
   voteOnPoll,
   updatePost,
} from "../services/postService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { getUserInitials } from "../utils/helpers";
import { useDispatch } from "react-redux";
import { toggleLikeStart, toggleLikeSuccess, toggleLikeFailure } from "../redux/slices/postSlice";

const PostCard = ({ post, onUpdate }) => {
   const { user } = useAuth();
   const dispatch = useDispatch();
   const [comment, setComment] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLiking, setIsLiking] = useState(false);
   const [isSharing, setIsSharing] = useState(false);
   const [showSettings, setShowSettings] = useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [showReportDialog, setShowReportDialog] = useState(false);
   const [reportReason, setReportReason] = useState("");
   const [isDeleting, setIsDeleting] = useState(false);

   // Edit mode state
   const [isEditing, setIsEditing] = useState(false);
   const [editedContent, setEditedContent] = useState(post.content);
   const [editedImageUrls, setEditedImageUrls] = useState(post.imageUrls || []);
   const [isUpdating, setIsUpdating] = useState(false);
   const [newImageUrl, setNewImageUrl] = useState("");

   const handleLike = async () => {
      if (!user) {
         toast.error("Please login to like posts");
         return;
      }

      try {
         setIsLiking(true);
         dispatch(toggleLikeStart());
         const isLiked = post.likes.includes(user.id);
         let response;

         if (isLiked) {
            response = await unlikePost(post._id);
         } else {
            response = await likePost(post._id);
         }

         dispatch(
            toggleLikeSuccess({
               _id: post._id,
               likes: response.data.data.likes,
               isLiked: !isLiked,
            }),
         );

         toast.success(isLiked ? "Post unliked" : "Post liked");
         if (onUpdate) onUpdate();
      } catch (error) {
         console.error("Error liking/unliking post:", error);
         dispatch(toggleLikeFailure(error.response?.data?.message || "Error liking/unliking post"));
         toast.error(error.response?.data?.message || "Error liking/unliking post");
      } finally {
         setIsLiking(false);
      }
   };

   const handleComment = async (e) => {
      e.preventDefault();
      if (!user) {
         toast.error("Please login to comment");
         return;
      }

      if (!comment.trim()) return;

      try {
         setIsSubmitting(true);
         await commentOnPost(post._id, { content: comment.trim() });
         setComment("");
         toast.success("Comment added");
         if (onUpdate) onUpdate();
      } catch (error) {
         console.error("Error adding comment:", error);
         toast.error(error.response?.data?.message || "Error adding comment");
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteComment = async (commentId) => {
      if (!user) {
         toast.error("Please login to delete comments");
         return;
      }

      try {
         await deleteComment(post._id, commentId);
         toast.success("Comment deleted");
         if (onUpdate) onUpdate();
      } catch (error) {
         console.error("Error deleting comment:", error);
         toast.error(error.response?.data?.message || "Error deleting comment");
      }
   };

   const handleDeletePost = async () => {
      if (!user) {
         toast.error("Please login to delete posts");
         return;
      }

      setShowDeleteConfirm(true);
      setShowSettings(false);
   };

   const confirmDeletePost = async () => {
      try {
         setIsDeleting(true);
         await deletePost(post._id);
         toast.success("Post deleted successfully");
         setShowDeleteConfirm(false);
         if (onUpdate) {
            onUpdate();
         }
      } catch (error) {
         console.error("Error deleting post:", error);
         toast.error(error.response?.data?.message || "Error deleting post");
      } finally {
         setIsDeleting(false);
         setShowDeleteConfirm(false);
      }
   };

   const handleReportPost = async () => {
      if (!user) {
         toast.error("Please login to report posts");
         return;
      }

      try {
         await reportPost(post._id, { reason: reportReason });
         toast.success("Post reported successfully");
         setShowReportDialog(false);
         setReportReason("");
      } catch (error) {
         console.error("Error reporting post:", error);
         toast.error(error.response?.data?.error || "Error reporting post");
      }
   };

   const handleShare = async () => {
      if (!user) {
         toast.error("Please login to share posts");
         return;
      }

      try {
         setIsSharing(true);
         // Create a shareable link
         const shareUrl = `${window.location.origin}/post/${post._id}`;

         // Check if Web Share API is available
         if (navigator.share) {
            await navigator.share({
               title: `${post.user.name}'s post`,
               text: post.content,
               url: shareUrl,
            });
         } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Post link copied to clipboard!");
         }
      } catch (error) {
         console.error("Error sharing post:", error);
         if (error.name !== "AbortError") {
            toast.error("Error sharing post");
         }
      } finally {
         setIsSharing(false);
      }
   };

   const handleVote = async (postId, optionIndex) => {
      if (!user) {
         toast.error("Please login to vote");
         return;
      }

      try {
         await voteOnPoll(postId, optionIndex);
         if (onUpdate) onUpdate();
         toast.success("Vote recorded successfully");
      } catch (error) {
         console.error("Error voting on poll:", error);
         toast.error(error.response?.data?.message || "Error voting on poll");
      }
   };

   const formatDate = (dateString) => {
      const now = new Date();
      const postDate = new Date(dateString);
      const diffTime = Math.abs(now - postDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 60) {
         return `${diffMinutes}m`;
      } else if (diffHours < 24) {
         return `${diffHours}h`;
      } else if (diffDays < 7) {
         return `${diffDays}d`;
      } else {
         const options = { month: "short", day: "numeric" };
         return postDate.toLocaleDateString(undefined, options);
      }
   };

   // Handle edit mode
   const handleEdit = () => {
      setIsEditing(true);
      setShowSettings(false);
   };

   // Handle adding new image URL
   const handleAddImageUrl = () => {
      if (!newImageUrl.trim()) return;
      if (editedImageUrls.length >= 4) {
         toast.error("Maximum 4 images allowed");
         return;
      }
      setEditedImageUrls([...editedImageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
   };

   // Handle removing image URL
   const handleRemoveImage = (index) => {
      setEditedImageUrls(editedImageUrls.filter((_, i) => i !== index));
   };

   // Handle save edit
   const handleSaveEdit = async () => {
      if (!editedContent.trim()) {
         toast.error("Post content cannot be empty");
         return;
      }

      setIsUpdating(true);
      try {
         const response = await updatePost(post._id, {
            content: editedContent.trim(),
            imageUrls: editedImageUrls,
         });

         if (response.data.success) {
            toast.success("Post updated successfully");
            setIsEditing(false);
            if (onUpdate) onUpdate();
         }
      } catch (error) {
         console.error("Error updating post:", error);
         toast.error(error.response?.data?.error || "Error updating post");
      } finally {
         setIsUpdating(false);
      }
   };

   // Helper for mood display
   const getMoodDisplay = (mood) => {
      switch ((mood || "").toUpperCase()) {
         case "POSITIVE":
            return { label: "Positive", color: "text-green-600", emoji: "😊" };
         case "NEGATIVE":
            return { label: "Negative", color: "text-red-600", emoji: "😞" };
         case "NEUTRAL":
         default:
            return { label: "Neutral", color: "text-gray-500", emoji: "😐" };
      }
   };
   const moodInfo = getMoodDisplay(post.sentiment?.mood);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className='bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-200'>
         {/* Post Header */}
         <div className='p-4 flex items-center justify-between'>
            <div className='flex items-center'>
               <div className='flex items-center'>
                  {post.user.profileImage ? (
                     <img
                        className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm'
                        src={post.user.profileImage}
                        alt={getUserInitials(post.user.name)}
                     />
                  ) : (
                     <div className='h-12 w-12 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white font-bold shadow-sm border-2 border-white'>
                        {getUserInitials(post.user.name)}
                     </div>
                  )}
                  <div className='ml-3'>
                     <Link to={`/profile/${post.user._id}`} className='font-semibold text-gray-900 hover:text-maple-red transition-colors'>
                        {post.user.name}
                     </Link>
                     <div className='flex items-center text-gray-500 text-sm'>
                        <span>{formatDate(post.createdAt)}</span>
                        {post.feeling && (
                           <>
                              <span className='mx-1'>•</span>
                              <span className='flex items-center'>
                                 <span className='mr-1 text-base'>
                                    {post.feeling.toLowerCase() === "happy" && "😊"}
                                    {post.feeling.toLowerCase() === "sad" && "😢"}
                                    {post.feeling.toLowerCase() === "excited" && "🎉"}
                                    {post.feeling.toLowerCase() === "blessed" && "🙏"}
                                    {post.feeling.toLowerCase() === "loved" && "❤️"}
                                    {post.feeling.toLowerCase() === "angry" && "😠"}
                                    {post.feeling.toLowerCase() === "thankful" && "🙏"}
                                    {post.feeling.toLowerCase() === "grateful" && "🙏"}
                                    {post.feeling.toLowerCase() === "amazing" && "🤩"}
                                    {post.feeling.toLowerCase() === "wonderful" && "✨"}
                                 </span>
                                 feeling&nbsp;<span className='font-medium'>{post.feeling.toLowerCase()}</span>
                              </span>
                           </>
                        )}
                        {post.location && (
                           <>
                              <span className='mx-1'>•</span>
                              <span className='flex items-center'>
                                 <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                    />
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                    />
                                 </svg>
                                 {post.location}
                              </span>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
            <div className='relative'>
               <button
                  onClick={() => setShowSettings(!showSettings)}
                  className='text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors'>
                  <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                     />
                  </svg>
               </button>

               {/* Post Settings Dropdown */}
               {showSettings && (
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10'>
                     {post.user._id === user?.id && (
                        <>
                           <button
                              onClick={handleEdit}
                              className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center'>
                              <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                 />
                              </svg>
                              Edit Post
                           </button>
                           <button
                              onClick={handleDeletePost}
                              className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center'>
                              <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                 />
                              </svg>
                              Delete Post
                           </button>
                        </>
                     )}
                     {post.user._id !== user?.id && (
                        <button
                           onClick={() => setShowReportDialog(true)}
                           className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center'>
                           <svg className='w-4 h-4 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                              />
                           </svg>
                           Report Post
                        </button>
                     )}
                  </motion.div>
               )}
            </div>
         </div>

         {/* Post Content */}
         <div className='px-4 pb-3'>
            {isEditing ? (
               <div className='space-y-4'>
                  <textarea
                     value={editedContent}
                     onChange={(e) => setEditedContent(e.target.value)}
                     className='w-full p-3 border border-gray-300 rounded-lg focus:ring-maple-red focus:border-maple-red transition-colors'
                     rows={4}
                     placeholder="What's on your mind?"
                  />

                  {/* Image URLs Section */}
                  <div className='space-y-2'>
                     <div className='flex items-center space-x-2'>
                        <input
                           type='url'
                           value={newImageUrl}
                           onChange={(e) => setNewImageUrl(e.target.value)}
                           placeholder='Add image URL'
                           className='flex-1 p-2 border border-gray-300 rounded-lg focus:ring-maple-red focus:border-maple-red'
                        />
                        <button
                           onClick={handleAddImageUrl}
                           className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-colors'>
                           Add
                        </button>
                     </div>

                     {/* Display existing images */}
                     {editedImageUrls.length > 0 && (
                        <div className='grid grid-cols-2 gap-2'>
                           {editedImageUrls.map((url, index) => (
                              <div key={index} className='relative'>
                                 <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className='w-full h-32 object-cover rounded-lg'
                                    onError={(e) => {
                                       e.target.src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                                    }}
                                 />
                                 <button
                                    onClick={() => handleRemoveImage(index)}
                                    className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'>
                                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                 </button>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Action Buttons */}
                  <div className='flex justify-end space-x-2'>
                     <button
                        onClick={() => setIsEditing(false)}
                        className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'>
                        Cancel
                     </button>
                     <button
                        onClick={handleSaveEdit}
                        disabled={isUpdating}
                        className={`px-4 py-2 rounded-lg text-white ${
                           isUpdating ? "bg-maple-red/60" : "bg-maple-red hover:bg-maple-red-dark"
                        } transition-colors`}>
                        {isUpdating ? "Saving..." : "Save Changes"}
                     </button>
                  </div>
               </div>
            ) : (
               <p className='text-gray-800 text-[15px] leading-relaxed'>{post.content}</p>
            )}
         </div>

         {/* Post Media */}
         {!isEditing && post.imageUrls?.length > 0 && (
            <div className='w-full'>
               {post.imageUrls.length === 1 ? (
                  <div className='relative pb-[75%] w-full'>
                     <img
                        src={post.imageUrls[0]}
                        alt='Post media'
                        className='absolute inset-0 w-full h-full object-contain bg-black/5'
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = "/placeholder-image.png";
                        }}
                     />
                  </div>
               ) : (
                  <div
                     className={`grid gap-1 ${
                        post.imageUrls.length === 2 ? "grid-cols-2" : post.imageUrls.length === 3 ? "grid-cols-2" : "grid-cols-2"
                     }`}>
                     {post.imageUrls.map((image, index) => (
                        <div key={index} className={`relative ${post.imageUrls.length === 3 && index === 0 ? "col-span-2" : ""}`}>
                           <div className='pb-[100%] relative'>
                              <img
                                 src={image}
                                 alt={`Post media ${index + 1}`}
                                 className='absolute inset-0 w-full h-full object-cover'
                                 onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-image.png";
                                 }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Poll Section */}
         {post.poll && post.poll.options && post.poll.options.length > 0 && (
            <div className='px-4 pb-4 pt-2'>
               <div className='bg-gray-50 rounded-xl p-4'>
                  <h3 className='font-semibold text-gray-900 mb-3'>{post.poll.question}</h3>
                  <div className='space-y-2'>
                     {post.poll.options.map((option, index) => {
                        const totalVotes = post.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                        const votePercentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                        const hasVoted = user && option.votes.includes(user.id);

                        return (
                           <div key={index} className='relative'>
                              <button
                                 onClick={() => handleVote(post._id, index)}
                                 disabled={!user}
                                 className={`w-full text-left p-3 rounded-lg border transition-all relative z-10 ${
                                    hasVoted
                                       ? "bg-maple-red/10 border-maple-red/20 text-maple-red"
                                       : "bg-white border-gray-200 hover:border-maple-red/30 hover:bg-maple-red/5"
                                 }`}>
                                 <div className='flex justify-between items-center'>
                                    <span>{option.text}</span>
                                    <span className='text-sm font-medium'>{votePercentage.toFixed(1)}%</span>
                                 </div>
                              </button>
                              <div
                                 className='absolute inset-0 bg-maple-red/5 rounded-lg transition-all'
                                 style={{
                                    width: `${votePercentage}%`,
                                    zIndex: 1,
                                 }}
                              />
                           </div>
                        );
                     })}
                  </div>
                  <div className='mt-3 text-sm text-gray-500 flex items-center justify-between'>
                     {post.poll.options.reduce((sum, option) => sum + option.votes.length, 0) > 0 && (
                        <span>{post.poll.options.reduce((sum, option) => sum + option.votes.length, 0)} votes</span>
                     )}
                     {post.poll.expiresAt && (
                        <span>{new Date(post.poll.expiresAt) > new Date() ? `Ends ${formatDate(post.poll.expiresAt)}` : "Poll ended"}</span>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* Mood Indicator (AI-analyzed) */}
         {post.sentiment?.mood && (
            <div className='flex items-center gap-2 px-4 pb-2'>
               <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 ${moodInfo.color}`}
                  title='This mood is analyzed by AI, not set by the user.'>
                  <span className='mr-1'>{moodInfo.emoji}</span>
                  <span>{moodInfo.label}</span>
                  {post.sentiment?.confidence > 0 && (
                     <span className='ml-1 text-gray-400'>({Math.round(post.sentiment.confidence * 100)}%)</span>
                  )}
               </span>
               <span className='text-xs text-gray-400 ml-2 italic' title='This is an automatic analysis, not user-provided.'>
                  (AI-analyzed mood)
               </span>
            </div>
         )}

         {/* Post Actions */}
         <div className='px-4 py-2 border-t border-gray-100 flex'>
            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleLike}
               disabled={isLiking}
               className={`flex-1 flex items-center justify-center py-2.5 rounded-lg transition-colors ${
                  post.likes.includes(user?.id)
                     ? "text-maple-red hover:bg-maple-red/5"
                     : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
               } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}>
               <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 mr-1.5'
                  fill={post.likes.includes(user?.id) ? "currentColor" : "none"}
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={2}
                     d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
               </svg>
               {isLiking ? "Liking..." : "Like"}
            </motion.button>
            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => document.getElementById(`comment-${post._id}`).focus()}
               className='flex-1 flex items-center justify-center py-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors'>
               <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={2}
                     d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
               </svg>
               Comment
            </motion.button>
            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleShare}
               disabled={isSharing}
               className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors ${
                  isSharing ? "opacity-50 cursor-not-allowed" : ""
               }`}>
               <svg className='h-5 w-5 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={2}
                     d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
                  />
               </svg>
               {isSharing ? "Sharing..." : "Share"}
            </motion.button>
         </div>

         {/* Comments Section */}
         <div className='px-4 py-3 border-t border-gray-100'>
            {post.comments && post.comments.length > 0 && (
               <div className='mb-4 space-y-2'>
                  {console.log("post", post.comments)}
                  {post.comments.map((comment) => (
                     <div key={comment._id} className='flex items-start group'>
                        <div className='flex-shrink-0'>
                           {comment.user.profileImage ? (
                              <img
                                 className='h-6 w-6 rounded-full object-cover border border-white shadow-sm'
                                 src={comment.user.profileImage}
                                 alt={comment.user.name}
                              />
                           ) : (
                              <div className='h-6 w-6 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white'>
                                 {getUserInitials(comment.user.name)}
                              </div>
                           )}
                        </div>
                        <div className='ml-2 flex-1'>
                           <div className='bg-gray-50 rounded-2xl px-3 py-1.5'>
                              <Link
                                 to={`/profile/${comment.user._id}`}
                                 className='text-gray-500 hover:text-maple-red transition-colors text-xs font-medium block mb-0.5'>
                                 {comment.user.username ? `@${comment.user.username}` : comment.user.name}
                              </Link>
                              <p className='text-gray-800 text-sm leading-relaxed'>{comment.content}</p>
                           </div>
                           <div className='flex items-center mt-0.5 ml-1 space-x-3 text-xs text-gray-500'>
                              <span className='text-[11px]'>{formatDate(comment.createdAt)}</span>
                              <button className='hover:text-gray-700 text-[11px] font-medium'>Like</button>
                              <button className='hover:text-gray-700 text-[11px] font-medium'>Reply</button>
                              {(comment.user._id === user?.id || post.user._id === user?.id) && (
                                 <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    className='text-gray-400 hover:text-red-500 transition-colors text-[11px] font-medium'>
                                    Delete
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Add Comment Form */}
            <form onSubmit={handleComment} className='flex items-center'>
               {user?.profileImage ? (
                  <img
                     className='h-6 w-6 rounded-full object-cover border border-white shadow-sm'
                     src={user.profileImage}
                     alt={user?.name}
                  />
               ) : (
                  <div className='h-6 w-6 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white text-xs font-bold shadow-sm border border-white'>
                     {getUserInitials(user?.name)}
                  </div>
               )}
               <div className='flex-1 ml-2 relative'>
                  <input
                     id={`comment-${post._id}`}
                     type='text'
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     placeholder='Write a comment...'
                     className='w-full bg-gray-50 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-maple-red/50 border border-gray-100'
                  />
                  <button
                     type='submit'
                     disabled={isSubmitting || !comment.trim()}
                     className={`absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-xs transition-colors ${
                        isSubmitting || !comment.trim()
                           ? "text-gray-400 cursor-not-allowed"
                           : "text-maple-red hover:text-maple-red-dark font-medium"
                     }`}>
                     {isSubmitting ? "Posting..." : "Post"}
                  </button>
               </div>
            </form>
         </div>

         {/* Delete Comment Confirmation Modal */}
         {showDeleteConfirm && (
            <div className='fixed inset-0 z-[100] overflow-y-auto'>
               <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center'>
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='fixed inset-0 transition-opacity'
                     onClick={() => !isDeleting && setShowDeleteConfirm(false)}>
                     <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                  </motion.div>

                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className='relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg z-[110]'>
                     <div className='mb-4'>
                        <h3 className='text-lg font-medium text-gray-900'>Delete Post</h3>
                        <p className='mt-2 text-sm text-gray-500'>
                           Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                     </div>

                     <div className='mt-6 flex justify-end space-x-3'>
                        <button
                           type='button'
                           onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                           disabled={isDeleting}
                           className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red disabled:opacity-50'>
                           Cancel
                        </button>
                        <button
                           type='button'
                           onClick={confirmDeletePost}
                           disabled={isDeleting}
                           className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50'>
                           {isDeleting ? (
                              <div className='flex items-center'>
                                 <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' fill='none' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                    <path
                                       className='opacity-75'
                                       fill='currentColor'
                                       d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                 </svg>
                                 Deleting...
                              </div>
                           ) : (
                              "Delete Post"
                           )}
                        </button>
                     </div>
                  </motion.div>
               </div>
            </div>
         )}

         {/* Report Dialog */}
         <AnimatePresence>
            {showReportDialog && (
               <div className='fixed inset-0 z-[100] overflow-y-auto'>
                  <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center'>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 transition-opacity'
                        onClick={() => setShowReportDialog(false)}>
                        <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className='relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg z-[110]'>
                        <div className='mb-4'>
                           <h3 className='text-lg font-medium text-gray-900'>Report Post</h3>
                           <p className='mt-2 text-sm text-gray-500'>
                              Please provide a reason for reporting this post. This will help our moderators review the content
                              appropriately.
                           </p>
                        </div>

                        <div className='mt-4'>
                           <textarea
                              value={reportReason}
                              onChange={(e) => setReportReason(e.target.value)}
                              placeholder='Enter your reason for reporting this post...'
                              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maple-red focus:border-maple-red'
                              rows={4}
                           />
                        </div>

                        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                           <button
                              type='button'
                              onClick={handleReportPost}
                              disabled={!reportReason.trim()}
                              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed'>
                              Report
                           </button>
                           <button
                              type='button'
                              onClick={() => setShowReportDialog(false)}
                              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red sm:mt-0 sm:w-auto sm:text-sm'>
                              Cancel
                           </button>
                        </div>
                     </motion.div>
                  </div>
               </div>
            )}
         </AnimatePresence>
      </motion.div>
   );
};

export default PostCard;
