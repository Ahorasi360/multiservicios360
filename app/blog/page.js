import BlogListClient from './BlogListClient';
import { getAllPosts } from '../../lib/blog';

export const metadata = {
  title: 'Blog | Multi Servicios 360',
  description: 'Artículos legales, noticias y recursos para la comunidad latina en California.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListClient posts={posts} />;
}
