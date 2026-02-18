// app/blog/[slug]/page.js — Spanish version
import { getPostBySlug, getAllPosts } from '../../../lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  const url = `https://multiservicios360.net/blog/${slug}`;
  const enUrl = `https://multiservicios360.net/en/blog/${slug}`;
  return {
    title: post.title + ' | Multi Servicios 360 Blog',
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      locale: 'es_US',
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image && { images: [{ url: `https://multiservicios360.net${post.image}`, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.image && { images: [`https://multiservicios360.net${post.image}`] }),
    },
    alternates: {
      canonical: url,
      languages: {
        'es': url,
        'en': enUrl,
        'x-default': url,
      },
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return <BlogPostClient post={post} relatedPosts={related} lang="es" />;
}
