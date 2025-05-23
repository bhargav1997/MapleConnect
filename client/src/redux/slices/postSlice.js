import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   posts: [],
   currentPost: null,
   loading: false,
   error: null,
   hasMore: true,
   page: 1,
};

const postSlice = createSlice({
   name: "post",
   initialState,
   reducers: {
      // Create post
      createPostStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      createPostSuccess: (state, action) => {
         state.loading = false;
         state.posts.unshift(action.payload);
      },
      createPostFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Get posts
      getPostsStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      getPostsSuccess: (state, action) => {
         state.loading = false;
         state.posts = [...state.posts, ...action.payload.posts];
         state.hasMore = action.payload.hasMore;
         state.page = action.payload.page;
      },
      getPostsFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Get single post
      getPostStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      getPostSuccess: (state, action) => {
         state.loading = false;
         state.currentPost = action.payload;
      },
      getPostFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Update post
      updatePostStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      updatePostSuccess: (state, action) => {
         state.loading = false;
         const index = state.posts.findIndex((post) => post._id === action.payload._id);
         if (index !== -1) {
            state.posts[index] = action.payload;
         }
         if (state.currentPost?._id === action.payload._id) {
            state.currentPost = action.payload;
         }
      },
      updatePostFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Delete post
      deletePostStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      deletePostSuccess: (state, action) => {
         state.loading = false;
         state.posts = state.posts.filter((post) => post._id !== action.payload);
         if (state.currentPost?._id === action.payload) {
            state.currentPost = null;
         }
      },
      deletePostFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Like/Unlike post
      toggleLikeStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      toggleLikeSuccess: (state, action) => {
         state.loading = false;
         const post = state.posts.find((p) => p._id === action.payload._id);
         if (post) {
            post.likes = action.payload.likes;
            post.isLiked = action.payload.isLiked;
         }
         if (state.currentPost?._id === action.payload._id) {
            state.currentPost.likes = action.payload.likes;
            state.currentPost.isLiked = action.payload.isLiked;
         }
      },
      toggleLikeFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Add comment
      addCommentStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      addCommentSuccess: (state, action) => {
         state.loading = false;
         const post = state.posts.find((p) => p._id === action.payload.postId);
         if (post) {
            post.comments.push(action.payload.comment);
         }
         if (state.currentPost?._id === action.payload.postId) {
            state.currentPost.comments.push(action.payload.comment);
         }
      },
      addCommentFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Delete comment
      deleteCommentStart: (state) => {
         state.loading = true;
         state.error = null;
      },
      deleteCommentSuccess: (state, action) => {
         state.loading = false;
         const post = state.posts.find((p) => p._id === action.payload.postId);
         if (post) {
            post.comments = post.comments.filter((c) => c._id !== action.payload.commentId);
         }
         if (state.currentPost?._id === action.payload.postId) {
            state.currentPost.comments = state.currentPost.comments.filter((c) => c._id !== action.payload.commentId);
         }
      },
      deleteCommentFailure: (state, action) => {
         state.loading = false;
         state.error = action.payload;
      },

      // Reset state
      resetPostState: (state) => {
         state.posts = [];
         state.currentPost = null;
         state.loading = false;
         state.error = null;
         state.hasMore = true;
         state.page = 1;
      },
   },
});

export const {
   createPostStart,
   createPostSuccess,
   createPostFailure,
   getPostsStart,
   getPostsSuccess,
   getPostsFailure,
   getPostStart,
   getPostSuccess,
   getPostFailure,
   updatePostStart,
   updatePostSuccess,
   updatePostFailure,
   deletePostStart,
   deletePostSuccess,
   deletePostFailure,
   toggleLikeStart,
   toggleLikeSuccess,
   toggleLikeFailure,
   addCommentStart,
   addCommentSuccess,
   addCommentFailure,
   deleteCommentStart,
   deleteCommentSuccess,
   deleteCommentFailure,
   resetPostState,
} = postSlice.actions;

export default postSlice.reducer;
