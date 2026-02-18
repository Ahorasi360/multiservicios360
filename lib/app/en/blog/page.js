// app/en/blog/page.js — English blog list
import BlogListClient from '../../blog/BlogListClient';
import { getAllPosts } from '../../../lib/blog';

export const metadata = {
  title: 'Blog | Multi Servicios 360',
  description: 'Legal articles, news, and resources for the Latino community in California. Guides on power of attorney, living trust, LLC, travel letters, and more.',
  openGraph: {
    title: 'Blog | Multi Servicios 360',
    description: 'Legal articles and resources for the Latino community in California.',
    url: 'https://multiservicios360.net/en/blog',
  },
  alternates: {
    canonical: 'https://multiservicios360.net/en/blog',
    languages: {
      'en': 'https://multiservicios360.net/en/blog',
      'es': 'https://multiservicios360.net/blog',
      'x-default': 'https://multiservicios360.net/blog',
    },
  },
};

export default function BlogPageEn() {
  const posts = getAllPosts();
  return <BlogListClient posts={posts} lang="en" />;
}
