// lib/blog.js
// Reads markdown files from /content/blog/ and parses frontmatter + content

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Get all blog posts, sorted by date (newest first)
 */
export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace('.md', '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    return {
      slug,
      title: data.title || '',
      title_en: data.title_en || data.title || '',
      excerpt: data.excerpt || '',
      excerpt_en: data.excerpt_en || data.excerpt || '',
      category: data.category || 'general',
      date: data.date ? new Date(data.date).toISOString() : '',
      author: data.author || 'Multi Servicios 360',
      image: data.image || null,
      published: data.published !== false,
    };
  });

  return posts
    .filter(p => p.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Split bilingual content if separator exists
  let contentEs = content;
  let contentEn = content;

  if (content.includes('---EN---')) {
    const parts = content.split('---EN---');
    contentEs = parts[0].trim();
    contentEn = parts[1].trim();
  }

  return {
    slug,
    title: data.title || '',
    title_en: data.title_en || data.title || '',
    excerpt: data.excerpt || '',
    excerpt_en: data.excerpt_en || data.excerpt || '',
    category: data.category || 'general',
    date: data.date ? new Date(data.date).toISOString() : '',
    author: data.author || 'Multi Servicios 360',
    image: data.image || null,
    content: contentEs,
    content_en: contentEn,
  };
}

/**
 * Get all unique categories
 */
export function getCategories() {
  const posts = getAllPosts();
  return [...new Set(posts.map(p => p.category))];
}
