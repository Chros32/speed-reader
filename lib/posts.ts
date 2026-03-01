import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      author: data.author,
      slug: data.slug,
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));

  for (const filename of files) {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.slug === slug) {
      return {
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        slug: data.slug,
        content,
      };
    }
  }

  return null;
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));

  return files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return data.slug as string;
  });
}
