import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const imageUrl = project.image 
    ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${project.image.replace('uploads/', '')}`
    : '/placeholder-project.jpg';
    
  return (
    <Link 
      to={`/project/${project._id}`} 
      className="block overflow-hidden rounded-xl bg-white/2 border border-white/10 shadow-xl backdrop-blur-3xl transition-all duration-300 hover:shadow-purple-500/20 hover:translate-y-[-4px]"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.target.src = '/placeholder-project.jpg';
            e.target.onerror = null;
          }}
        />
      </div>
      <div className="p-5">
        <h3 className="mb-2 truncate text-xl font-bold text-white">{project.title}</h3>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies?.map((tech, index) => (
            <span 
              key={index}
              className="rounded-lg bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-300"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <p className="mb-4 line-clamp-3 text-slate-300">
          {project.description}
        </p>
        <div className="text-purple-400 bg-purple-400/10 text-center p-3 rounded-lg">
          <span>View Project</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;