"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/useData";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft, Calendar, User, Tag, Loader2, Share2,
} from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch single post by slug
  const { data: posts, isLoading } = useBlogPosts(`slug=${slug}`);
  // The API returns the single post when slug is provided
  const post = Array.isArray(posts) ? posts[0] : (posts as any);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const tags = post.tags?.split(",").map((t: string) => t.trim()).filter(Boolean) || [];

  return (
    <div className="container-custom py-8 md:py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--accent)] mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      <article className="max-w-3xl mx-auto">
        {/* Cover image */}
        {post.coverImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                         bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 pb-6 border-b text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User size={14} />
            {post.author || "Eduwave Team"}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="ml-auto flex items-center gap-1 text-gray-400 hover:text-[var(--accent)] transition-colors"
          >
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Content */}
        <div className="prose-eduwave mt-8">
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : post.excerpt ? (
            <p>{post.excerpt}</p>
          ) : (
            <p className="text-gray-500 italic">No content available.</p>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white text-center">
          <h3 className="text-xl font-bold mb-2 text-white">Interested in Studying in Malaysia?</h3>
          <p className="text-blue-100/80 mb-6">
            Get expert guidance from our team. Free consultation available.
          </p>
          <Link href="/contact" className="btn-primary">
            Get Free Consultation
          </Link>
        </div>
      </article>
    </div>
  );
}
