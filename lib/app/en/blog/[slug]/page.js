// app/en/blog/[slug]/page.js — English version
import { getPostBySlug, getAllPosts } from '../../../../lib/blog';
import { notFound } from 'next/navigation';
import BlogPostClient from '../../../blog/[slug]/BlogPostClient';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  const enUrl = `https://multiservicios360.net/en/blog/${slug}`;
  const esUrl = `https://multiservicios360.net/blog/${slug}`;
  const title = post.title_en || post.title;
  const description = post.excerpt_en || post.excerpt;
  return {
    title: title + ' | Multi Servicios 360 Blog',
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: enUrl,
      type: 'article',
      locale: 'en_US',
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image && { images: [{ url: `https://multiservicios360.net${post.image}`, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      ...(post.image && { images: [`https://multiservicios360.net${post.image}`] }),
    },
    alternates: {
      canonical: enUrl,
      languages: {
        'en': enUrl,
        'es': esUrl,
        'x-default': esUrl,
      },
    },
  };
}

export default async function BlogPostPageEn({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const related = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return <BlogPostClient post={post} relatedPosts={related} lang="en" />;
}
