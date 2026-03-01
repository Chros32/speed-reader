import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog - Read Fast',
  description:
    'Tips, techniques, and science-backed insights to help you read faster and retain more.',
  openGraph: {
    title: 'Blog - Read Fast',
    description:
      'Tips, techniques, and science-backed insights to help you read faster and retain more.',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-[var(--muted)] mb-10 text-lg">
          Tips, science, and strategies to help you read faster.
        </p>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-primary-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[var(--muted)] mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                    <span>{post.author}</span>
                    <span>·</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
                <ArrowRight
                  size={20}
                  className="shrink-0 mt-1 text-[var(--muted)] group-hover:text-primary-500 transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
