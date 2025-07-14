import {
  CreatePostRequest,
  DeletePostResponse,
  LikePostResponse,
  LoginRequest,
  LoginResponse,
  PaginationParams,
  Post,
  PostCommentRequest,
  PostCommentResponse,
  PostCommentsResponse,
  PostLikesResponse,
  PostListResponse,
  RegisterRequest,
  RegisterResponse,
  SearchPostsParams,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdatePostRequest,
  UpdateProfileRequest,
  User,
  UserPostsParams,
} from '@/interfaces/api';
import { AxiosInstanceLocal } from '@/services/axios';

const apiLocal = {
  // Authentication
  postRegister: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await AxiosInstanceLocal.post('/auth/register', data);
    return res.data;
  },

  postLogin: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await AxiosInstanceLocal.post('/auth/login', data);
    return res.data;
  },

  // Users
  getUserByEmail: async (email: string): Promise<User> => {
    const res = await AxiosInstanceLocal.get(`/users/by-email/${email}`);
    return res.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await AxiosInstanceLocal.get(`/users/${id}`);
    return res.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const res = await AxiosInstanceLocal.patch('/users/profile', data);
    return res.data;
  },

  updatePassword: async (
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> => {
    const res = await AxiosInstanceLocal.patch('/users/password', data);
    return res.data;
  },

  // Posts
  getRecommendedPosts: async (
    params?: PaginationParams
  ): Promise<PostListResponse> => {
    const res = await AxiosInstanceLocal.get('/posts/recommended', {
      params,
    });
    return res.data;
  },

  getMostLikedPosts: async (
    params?: PaginationParams
  ): Promise<PostListResponse> => {
    const res = await AxiosInstanceLocal.get('/posts/most-liked', { params });
    return res.data;
  },

  getMyPosts: async (params?: PaginationParams): Promise<PostListResponse> => {
    const res = await AxiosInstanceLocal.get('/posts/my-posts', { params });
    return res.data;
  },

  searchPosts: async (params: SearchPostsParams): Promise<PostListResponse> => {
    const res = await AxiosInstanceLocal.get('/posts/search', { params });
    return res.data;
  },

  getPostById: async (id: number): Promise<Post> => {
    const res = await AxiosInstanceLocal.get(`/posts/${id}`);
    return res.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    data.tags.forEach((tag) => formData.append('tags', tag));
    formData.append('image', data.image);

    const res = await AxiosInstanceLocal.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updatePost: async (id: number, data: UpdatePostRequest): Promise<Post> => {
    const res = await AxiosInstanceLocal.patch(`/posts/${id}`, data);
    return res.data;
  },

  deletePost: async (id: number): Promise<DeletePostResponse> => {
    const res = await AxiosInstanceLocal.delete(`/posts/${id}`);
    return res.data;
  },

  likePost: async (id: number): Promise<LikePostResponse> => {
    const res = await AxiosInstanceLocal.post(`/posts/${id}/like`);
    return res.data;
  },

  getPostLikes: async (id: number): Promise<PostLikesResponse> => {
    const res = await AxiosInstanceLocal.get(`/posts/${id}/likes`);
    return res.data;
  },

  getPostComments: async (id: number): Promise<PostCommentsResponse> => {
    const res = await AxiosInstanceLocal.get(`/posts/${id}/comments`);
    return res.data;
  },

  getUserPosts: async (params: UserPostsParams): Promise<PostListResponse> => {
    const res = await AxiosInstanceLocal.get(
      `/posts/by-user/${params.userId}`,
      {
        params: { limit: params.limit, page: params.page },
      }
    );
    return res.data;
  },

  // Comments
  createComment: async (
    postId: number,
    data: PostCommentRequest
  ): Promise<PostCommentResponse> => {
    const res = await AxiosInstanceLocal.post(`/comments/${postId}`, data);
    return res.data;
  },

  getComments: async (postId: number): Promise<PostCommentsResponse> => {
    const res = await AxiosInstanceLocal.get(`/comments/${postId}`);
    return res.data;
  },
};

export default apiLocal;
