"use client";

import Link from "next/link";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/useData";
import { formatDate } from "@/lib/utils";
import { Loader2, Calendar, User, ArrowRight, Newspaper } from "lucide-react";

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();

  return (
    <div>
      {/* Hero */}
      <div className="dark-gradient-bg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] py-14 md:py-20 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[280px] h-[280px] rounded-full bg-white/[0.03] animate-float" />
          <div className="absolute bottom-1/4 right-1/3 w-[180px] h-[180px] rounded-full bg-[var(--accent)]/[0.04]" style={{ animation: "float 5s ease-in-out infinite reverse" }} />
        </div>
        <div className="container-custom text-center relative z-10" data-anim="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-4">
            <Newspaper size={15} />
            Latest Updates
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Blog</h1>
          <p className="text-blue-100/80 text-base md:text-lg">
            Latest news, tips, and insights about studying in Malaysia.
          </p>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-anim-stagger="fade-up">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card group overflow-hidden"
              >
                {post.coverImage && (
                  <div className="bg-gray-100 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
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
    </div>
  );
}
