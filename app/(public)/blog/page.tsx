"use client";

import Link from "next/link";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/useData";
import { formatDate, truncate } from "@/lib/utils";
import { Loader2, Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">Blog</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Latest news, tips, and insights about studying in Malaysia.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
        </div>
      ) : !posts || posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card group overflow-hidden"
            >
              {post.coverImage && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.split(",").slice(0, 2).map((tag) => (
                      <span key={tag} className="badge bg-[var(--accent)]/10 text-[var(--accent)]">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="text-lg font-bold text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                  <ArrowRight size={14} className="text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
