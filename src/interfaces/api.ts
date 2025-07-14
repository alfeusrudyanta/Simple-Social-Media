// Authentication types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  headline: string | null;
  avatarUrl: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  headline?: string;
  avatar?: File;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
}

// Post types
export interface PostAuthor {
  id: number;
  name: string;
  email: string;
  headline?: string | null;
  avatarUrl?: string | null;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: PostAuthor;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  tags: string[];
  image: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  tags?: string[];
  image?: File;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LikePostResponse extends Post {}

export interface DeletePostResponse {
  success: boolean;
}

// Comment types
export interface CommentAuthor {
  id: number;
  name: string;
  headline?: string | null;
  avatarUrl?: string | null;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: CommentAuthor;
}

export interface PostCommentRequest {
  content: string;
}

export interface PostCommentResponse {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  post: number;
  createdAt: string;
}

// Query parameters
export interface PaginationParams {
  limit?: number;
  page?: number;
}

export interface SearchPostsParams extends PaginationParams {
  query: string;
}

export interface UserPostsParams extends PaginationParams {
  userId: number;
}

// Response types for likes
export interface UserLike {
  id: number;
  name: string;
  headline: string | null;
  avatarUrl: string | null;
}

export type PostLikesResponse = UserLike[];
export type PostCommentsResponse = Comment[];
