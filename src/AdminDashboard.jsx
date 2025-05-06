import { useState, useEffect } from 'react';
import { 
  FaTimes as FaX, 
  FaFolder as FaFolders, 
  FaPlus, 
  FaUser 
} from 'react-icons/fa';

// API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Main Dashboard component
function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    image: null
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  // Fetch current user data
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Token might be invalid or expired
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setAuthToken(null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setAuthToken(null);
  };

  // Handle project form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle technologies input (comma-separated list)
  const handleTechInput = (e) => {
    const techString = e.target.value;
    const techArray = techString.split(',').map(item => item.trim()).filter(item => item);
    setFormData({
      ...formData,
      technologies: techArray
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // Create new project
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('technologies', JSON.stringify(formData.technologies));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update existing project
  const updateProject = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('technologies', JSON.stringify(formData.technologies));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/projects/${selectedProject._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }

      const updatedProject = await response.json();
      setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete project');
        }

        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Open modal for editing a project
  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
      image: null
    });
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Open modal for creating a new project
  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      image: null
    });
    setSelectedProject(null);
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/2 backdrop-blur-3xl border border-white/10 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-2 text-white/35">Please sign in to continue</p>
          </div>
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white "
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white "
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-black"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Main dashboard layout (when logged in)
  return (
    <div className="flex h-screen bg-black">

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-black border-b border-white/15">
          <div className="flex items-center">
            <h1 className="ml-4 text-lg font-medium text-white">Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center">
            
            <div className="flex items-center ml-4">
            <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-indigo-100 bg-indigo-600 rounded-md"
          >
            Logout
          </button>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Status bar */}
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <FaFolders className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-white/75">Total Projects</h2>
                    <p className="text-2xl font-semibold text-white">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <FaUser className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-sm font-medium text-white/75">Last Updated</h2>
                    <p className="text-2xl font-semibold text-white">
                      {projects.length > 0 ? new Date().toLocaleDateString() : '-'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FaPlus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-white/75">Add Project</h2>
                    </div>
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    New Project
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Project list */}
          <div className="bg-white/5 border border-white/10 rounded-lg shadow overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-medium text-white">Projects</h2>
              <div className="flex">
                <span className="text-sm text-white/35">
                  {loading ? 'Loading...' : `${projects.length} projects`}
                </span>
              </div>
            </div>
            
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No projects found. Create your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div key={project._id} className="overflow-hidden bg-black border border-white/10 rounded-lg shadow-sm">
                    <div className="h-40 ">
                      {project.image ? (
                        <img 
                          src={`${API_BASE_URL}/${project.image}`} 
                          alt={project.title}
                          className="object-cover w-full h-full"
                          onError={(e) => e.target.src = '/api/placeholder/300/160'}
                        />
                      ) : (
                        <img 
                          src="https://placehold.com" 
                          alt="Project placeholder"
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-medium text-white">{project.title}</h3>
                      <p className="mb-4 text-sm text-white/75 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap mb-4">
                        {project.technologies && project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 mr-2 mb-2 text-xs text-indigo-700 bg-indigo-700/20 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex p-4 justify-between">
                      <button
                        onClick={() => openEditModal(project)}
                        className="flex items-center justify-center flex-1 px-4 py-2 text-sm text-white bg-gray-100/10 hover:bg-gray-100/5 rounded-lg mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="flex items-center justify-center flex-1 px-4 py-2 text-sm bg-red-500/20 text-red-700 hover:bg-red-700/20 rounded-lg ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Project modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-3xl">
          <div className="w-full max-w-md p-6 bg-white/5 border border-white/10  rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-white">
                {modalMode === 'create' ? 'Create New Project' : 'Edit Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                <FaX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={modalMode === 'create' ? createProject : updateProject}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-white">
                  Project Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="technologies" className="block mb-2 text-sm font-medium text-white">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies.join(', ')}
                  onChange={handleTechInput}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 "
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-white">
                  Project Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="block w-full px-3 py-2 text-sm text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  accept="image/*"
                />
                {modalMode === 'edit' && selectedProject?.image && (
                  <div className="mt-2 text-sm text-gray-500">
                    Current image: {selectedProject.image.split('/').pop()}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit" 
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {modalMode === 'create' ? 'Create Project' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default AdminDashboard;