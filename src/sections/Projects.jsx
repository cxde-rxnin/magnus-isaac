import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects, testApiConnection } from '../services/api';

const categoryInfo = { /* Keep categoryInfo object same as before */ };

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionTest, setConnectionTest] = useState(null);

  useEffect(() => {
    // Test API connection first
    const checkApiConnection = async () => {
      try {
        const testResult = await testApiConnection();
        setConnectionTest(testResult);
        console.log('API connection test result:', testResult);
        
        // If connection test shows HTML response, display error
        if (testResult.isHtml) {
          setError('API returning HTML instead of JSON. Check your Vite proxy configuration.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Connection test error:', err);
      }
      
      // Continue with projects fetch if connection test didn't fail
      getProjects();
    };
    
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data && typeof data === 'object') {
          // If data is an object that might contain an array of projects
          const projectsArray = data.projects || data.data || data.results || [];
          setProjects(Array.isArray(projectsArray) ? projectsArray : []);
        } else {
          // Handle unexpected data format
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

  // Only attempt to group projects if they are an array
  const groupedProjects = Array.isArray(projects) 
    ? projects.reduce((groups, project) => {
        const category = project.category || 'Other';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(project);
        return groups;
      }, {})
    : {};

  return (
    <Section id="projects" className='bg-black'>
      <div className="relative">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute right-0 bottom-1/4 h-64 w-64 rounded-full bg-indigo-500 blur-3xl"></div>
        </div>
      
        <div className="relative">
          <h2 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl">My Projects</h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-slate-300 md:mb-16">
            Explore the project categories listed below...
          </p>

          {loading && (
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
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

          {!loading && !error && (
            <div className="grid gap-10 md:grid-cols-2 lg:gap-14">
              {Object.entries(categoryInfo).map(([category, info]) => (
                <div key={category} className="flex flex-col rounded-lg bg-slate-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-blue-900/5">
                  <div className="mb-5 flex items-center">
                    <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md shadow-blue-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </span>
                    <h3 className="text-2xl font-bold text-white lg:text-3xl">{category} Projects</h3>
                  </div>
                  <p className="mb-6 pl-14 text-sm leading-relaxed text-slate-400">{info.description}</p>

                  {groupedProjects[category]?.length > 0 ? (
                    <div className="grid flex-grow grid-cols-1 gap-6 pl-14">
                      {groupedProjects[category].map(project => (
                        <ProjectCard key={project._id} project={project} />
                      ))}
                    </div>
                  ) : (
                    <p className="pl-14 text-sm italic text-slate-500">No projects in this category yet.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Projects;