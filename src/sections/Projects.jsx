import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects, testApiConnection } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionTest, setConnectionTest] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const testResult = await testApiConnection();
        setConnectionTest(testResult);
        console.log('API connection test result:', testResult);
        
        if (testResult.isHtml) {
          setError('API returning HTML instead of JSON. Check your Vite proxy configuration.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Connection test error:', err);
      }
      
      getProjects();
    };
    
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data && typeof data === 'object') {
          const projectsArray = data.projects || data.data || data.results || [];
          setProjects(Array.isArray(projectsArray) ? projectsArray : []);
        } else {
          setProjects([]);
          setError('Received invalid data format from server');
          console.error('Invalid data format:', data);
        }
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    checkApiConnection();
  }, []);

  return (
    <Section id="projects" className="bg-black">
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-purple-500 blur-3xl"></div>
          <div className="absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
      
        <div className="relative">
          <h2 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">My Projects</h2>
          <p className="mx-auto mb-6 max-w-3xl text-center text-lg text-slate-300">
            Explore my portfolio showcasing various projects across different technologies.
          </p>

          {loading && (
            <div className="my-12 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}
          
          {error && (
            <div className="rounded-lg bg-red-900/20 p-4 text-center backdrop-blur-sm">
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-red-100 p-2 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-bold text-red-400">{error}</p>
              {connectionTest && connectionTest.isHtml && (
                <p className="mt-2 text-sm text-red-300/80">
                  API proxy issue detected. Make sure your vite.config.js has the correct proxy setup.
                </p>
              )}
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="rounded-lg bg-slate-800/40 p-6 text-center backdrop-blur-md">
              <p className="text-slate-300">No projects found. Add some projects to showcase your work!</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Projects;