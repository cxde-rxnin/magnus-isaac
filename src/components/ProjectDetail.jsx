import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError('Failed to load project details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-project.jpg';
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    return `${API_BASE_URL}/${imagePath}`;
  };

  const getImages = () => {
    if (project.images && project.images.length > 0) {
      return project.images;
    } else if (project.image) {
      return [project.image];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-xl text-gray-300">Loading project details...</p>
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
          <Link to="/projects" className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg bg-slate-800/40 p-8 text-center backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-200">Project Not Found</h2>
          <p className="mb-6 text-gray-300">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/projects" className="rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const images = getImages();

  return (
    <div className="min-h-screen bg-black px-6 py-16 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <button 
          onClick={() => window.history.back()}
          className="mb-8 inline-flex items-center rounded-lg bg-slate-800/40 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-slate-700/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-8">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, index) => (
              <span 
                key={index}
                className="rounded-full bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-slate-800/20 p-6 backdrop-blur-md">
          <h2 className="mb-4 text-2xl font-bold text-white">About the Project</h2>
          <p className="whitespace-pre-line text-slate-300">{project.description}</p>
        </div>

        {images.length > 0 ? (
          <div className="mb-8 flex flex-col">
            {images.map((img, index) => (
              <div key={index} className="overflow-hidden rounded-xl">
                <img 
                  src={getImageUrl(img)} 
                  alt={`${project.title} - ${index + 1}`}
                  className="h-full w-full object-cover transition-transform hover:scale-105 mb-8 rounded-xl border-5 border-white/10"
                  onError={(e) => {
                    e.target.src = '/placeholder-project.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-8 overflow-hidden rounded-xl bg-slate-800">
            <img 
              src="/placeholder-project.jpg" 
              alt={project.title}
              className="h-64 w-full object-cover opacity-50"
            />
          </div>
        )}



      </div>
    </div>
  );
};

export default ProjectDetail;