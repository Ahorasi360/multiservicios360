import BlogListClient from './BlogListClient';
import { getAllPosts } from '../../lib/blog';

export const metadata = {
  title: 'Blog | Multi Servicios 360',
  description: 'Artículos legales, noticias y recursos para la comunidad latina en California. Guías sobre poder notarial, fideicomiso, LLC, carta de viaje y más.',
  openGraph: {
    title: 'Blog | Multi Servicios 360',
    description: 'Artículos legales y recursos para la comunidad latina en California.',
    url: 'https://multiservicios360.net/blog',
  },
  alternates: {
    canonical: 'https://multiservicios360.net/blog',
    languages: {
      'es': 'https://multiservicios360.net/blog',
      'en': 'https://multiservicios360.net/en/blog',
      'x-default': 'https://multiservicios360.net/blog',
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return <BlogListClient posts={posts} lang="es" />;
}
