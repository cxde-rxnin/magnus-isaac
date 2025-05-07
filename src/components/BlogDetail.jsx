import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchBlogPostByIdentifier } from '../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await fetchBlogPostByIdentifier(id);
        setBlogPost(post);
      } catch (err) {
        setError('Failed to load blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Prepare image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-blog.jpg';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    return `${API_BASE_URL}/uploads/${imagePath.replace('uploads/', '')}`;
  };

  // Handle multiple images if available
  const getImages = () => {
    if (blogPost?.images && blogPost?.images.length > 0) {
      return blogPost.images;
    } else if (blogPost?.image) {
      return [blogPost.image];
    }
    return [];
  };

  // Navigation for vertical slider
  const nextSlide = () => {
    const images = getImages();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    const images = getImages();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-xl text-gray-300">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-red-900/20 p-8 text-center backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-red-400">Error</h2>
          <p className="mb-6 text-red-200">{error}</p>
          <Link to="/blog" className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-slate-800/40 p-8 text-center backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-200">Blog Post Not Found</h2>
          <p className="mb-6 text-gray-300">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="min-h-screen bg-black px-6 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        {/* Back button - Go back in browser history */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center rounded-lg bg-slate-800/40 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-slate-700/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="mb-2">
          <h1 className="mb-4 text-2xl max-w-2xl font-bold text-white">{blogPost.title}</h1>
          <div className="flex flex-wrap gap-2">
            {blogPost.tags?.map((tech, index) => (
              <span 
                key={index}
                className="rounded-full bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

                {/* Date Published */}
        <div className="mb-8">
          <h3 className="text-sm font-bold">Date Published:</h3>
          <p className="text-white/50 ">{new Date(blogPost.publishedAt).toLocaleDateString()}</p>
        </div>

        {/* Blog images - Vertical slider */}
        {images.length > 0 ? (
          <div className="mb-8 relative">
            <div className="overflow-hidden rounded-xl">
              <img 
                src={getImageUrl(images[currentImageIndex])} 
                alt={`${blogPost.title} - ${currentImageIndex + 1}`}
                className="h-full w-full object-cover transition-transform hover:scale-105 mb-8 rounded-xl border-5 border-white/10"
                onError={(e) => {
                  e.target.src = '/placeholder-blog.jpg';
                  e.target.onerror = null;
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button 
                onClick={prevSlide}
                className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 overflow-hidden rounded-xl bg-slate-800">
            <img 
              src="/placeholder-blog.jpg" 
              alt={blogPost.title}
              className="h-64 w-full object-cover opacity-50"
            />
          </div>
        )}

        {/* Blog content */}
        <div className="w-full">
          <div className="content mt-6 text-white/75 font-medium line-clamp-0 whitespace-pre-line">
            {blogPost.content}
          </div>
        </div>


      </div>
    </div>
  );
};

export default BlogDetail;