import React from 'react';
import { FaLink, FaGithub } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
  const { title, description, technologies = [], projectUrl, repoUrl, imageUrl } = project;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 p-5 shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30 hover:bg-slate-800/70 hover:shadow-xl hover:shadow-blue-900/10">
        {/* Top shine effect on hover */}
        <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100"></div>
        
        {imageUrl && (
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700/70">
                <img 
                  src={imageUrl} 
                  alt={`${title} screenshot`} 
                  className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
        )}
        
        <h3 className="mb-1 text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{title}</h3>
        <p className="mb-4 flex-grow text-sm text-slate-300">{description}</p>

        {technologies.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span key={index} className="rounded-full border border-green-500/30 bg-slate-700/70 px-3 py-1 text-xs font-medium text-green-400 transition-colors duration-300 group-hover:border-green-500/50 group-hover:bg-slate-700 group-hover:text-green-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
        )}

        <div className="mt-auto flex items-center justify-end space-x-4 border-t border-slate-700/50 pt-3">
             {(projectUrl || repoUrl) && (
                 <a 
                    href={projectUrl || repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 transition-all duration-300 hover:text-blue-300 hover:underline"
                 > 
                    View Project 
                 </a>
             )}
             {projectUrl && repoUrl && (
                 <>
                    <a 
                      href={projectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Live Demo" 
                      className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-blue-400"
                    >
                      <FaLink size="1.1rem" />
                      <span className="sr-only">Live Demo</span>
                    </a>
                    <a 
                      href={repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="GitHub Repository" 
                      className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-slate-700 hover:text-blue-400"
                    >
                      <FaGithub size="1.1rem"/>
                      <span className="sr-only">GitHub Repository</span>
                    </a>
                 </>
             )}
        </div>
    </div>
  );
};

export default ProjectCard;