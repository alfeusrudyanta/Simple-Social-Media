interface Author {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
}

interface CardProps {
  post: Post;
  showImage?: boolean;
  variant?: 'default' | 'compact';
  Divider?: boolean;
  PersonalView?: boolean;
}

export default CardProps;
