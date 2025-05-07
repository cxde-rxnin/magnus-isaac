import { useState, useEffect } from 'react';
import {
  FaTimes as FaX,
  FaFolder as FaFolders,
  FaPlus,
  FaTrash,
  FaNewspaper,
  FaEdit,
} from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const initialProjectFormData = {
  title: '',
  description: '',
  technologies: [],
  images: [],
  imagesToRemove: []
};

const initialBlogFormData = {
  title: '',
  content: '',
  author: 'Admin',
  tags: [],
  status: 'draft',
  images: [],
  imagesToRemove: []
};

function AdminDashboard() {

  //General State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [generalError, setGeneralError] = useState(null); 
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState('create');
  const [projectFormData, setProjectFormData] = useState(initialProjectFormData);
  const [projectImagePreviewUrls, setProjectImagePreviewUrls] = useState([]);

  // Blog Posts State
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlogPosts, setLoadingBlogPosts] = useState(true);
  const [errorBlogPosts, setErrorBlogPosts] = useState(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogModalMode, setBlogModalMode] = useState('create');
  const [blogFormData, setBlogFormData] = useState(initialBlogFormData);
  const [blogImagePreviewUrls, setBlogImagePreviewUrls] = useState([]);

  // --- Authentication and Initialization ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        handleLogout();
        setGeneralError('Session expired. Please log in again.');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      handleLogout();
      setGeneralError('Could not verify session. Please log in again.');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProjectsData();
      fetchBlogPostsData();
    }
  }, [isLoggedIn]);



  // --- API Calls ---

  // Fetch Projects
  const fetchProjectsData = async () => {
    setLoadingProjects(true);
    setErrorProjects(null);
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error(`API error: ${response.status} - ${response.statusText}`);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setErrorProjects('Failed to load projects. ' + err.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Blog Posts (all, including drafts for admin)
  const fetchBlogPostsData = async () => {
    setLoadingBlogPosts(true);
    setErrorBlogPosts(null);
    try {
      const response = await fetch(`${API_BASE_URL}/blogposts/all`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error(`API error: ${response.status} - ${response.statusText}`);
      const data = await response.json();
      setBlogPosts(data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setErrorBlogPosts('Failed to load blog posts. ' + err.message);
    } finally {
      setLoadingBlogPosts(false);
    }
  };

  // --- Auth Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoadingLogin(true);
    setGeneralError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('authToken', data.token);
      setAuthToken(data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setGeneralError(err.message);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setAuthToken(null);
    setProjects([]); 
    setBlogPosts([]);
  };

  // --- Project Handlers ---
  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({ ...projectFormData, [name]: value });
  };

  const handleProjectTechInput = (e) => {
const value = e.target.value;
const techArray = value
  .split(',')
  .map(tech => tech.trim())
  .filter(tech => tech !== '');
    setProjectFormData(prev => ({
      ...prev,
      technologies: techArray
    }));
  };

  const handleProjectFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProjectFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setProjectImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveNewProjectImage = (index) => {
    URL.revokeObjectURL(projectImagePreviewUrls[index]);
    setProjectImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setProjectFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleRemoveExistingProjectImage = (imagePath) => {
    setProjectFormData(prev => ({ ...prev, imagesToRemove: [...prev.imagesToRemove, imagePath] }));
  };

  const toggleRemoveExistingProjectImage = (imagePath) => {
    setProjectFormData(prev => ({
      ...prev,
      imagesToRemove: prev.imagesToRemove.includes(imagePath)
        ? prev.imagesToRemove.filter(img => img !== imagePath)
        : [...prev.imagesToRemove, imagePath]
    }));
  };

  const createProjectHandler = async (e) => {
    e.preventDefault();
    setErrorProjects(null);
    const formDataToSend = new FormData();
    formDataToSend.append('title', projectFormData.title);
    formDataToSend.append('description', projectFormData.description);
    formDataToSend.append('technologies', JSON.stringify(projectFormData.technologies));
    projectFormData.images.forEach(image => formDataToSend.append('images', image));

    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formDataToSend
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create project');
      setProjects(prev => [data, ...prev]);
      setIsProjectModalOpen(false);
      resetProjectForm();
    } catch (err) { setErrorProjects(err.message); }
  };

  const updateProjectHandler = async (e) => {
    e.preventDefault();
    setErrorProjects(null);
    const formDataToSend = new FormData();
    formDataToSend.append('title', projectFormData.title);
    formDataToSend.append('description', projectFormData.description);
    formDataToSend.append('technologies', JSON.stringify(projectFormData.technologies));
    projectFormData.images.forEach(image => formDataToSend.append('images', image));
    if (projectFormData.imagesToRemove.length > 0) {
      formDataToSend.append('removeImages', JSON.stringify(projectFormData.imagesToRemove));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${selectedProject._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formDataToSend
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update project');
      setProjects(prev => prev.map(p => p._id === data._id ? data : p));
      setIsProjectModalOpen(false);
      resetProjectForm();
    } catch (err) { setErrorProjects(err.message); }
  };

  const deleteProjectHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setErrorProjects(null);
      try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete project');
        setProjects(prev => prev.filter(p => p._id !== id));
      } catch (err) { setErrorProjects(err.message); }
    }
  };

  const openProjectEditModal = (project) => {
    setSelectedProject(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
      images: [],
      imagesToRemove: []
    });
    setProjectImagePreviewUrls([]);
    setProjectModalMode('edit');
    setIsProjectModalOpen(true);
  };

  const openProjectCreateModal = () => {
    resetProjectForm();
    setProjectModalMode('create');
    setIsProjectModalOpen(true);
  };

  const resetProjectForm = () => {
    projectImagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setProjectFormData(initialProjectFormData);
    setProjectImagePreviewUrls([]);
    setSelectedProject(null);
    setErrorProjects(null);
  };

  // --- Blog Post Handlers ---
  const handleBlogInputChange = (e) => {
    const { name, value } = e.target;
    setBlogFormData({ ...blogFormData, [name]: value });
  };

  const handleBlogTagsInput = (e) => {
    const value = e.target.value;
    // Split by comma, trim whitespace, and filter out empty strings
    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    setBlogFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  const handleBlogFileChange = (e) => {
    const files = Array.from(e.target.files);
    setBlogFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setBlogImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveNewBlogImage = (index) => {
    URL.revokeObjectURL(blogImagePreviewUrls[index]);
    setBlogImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    setBlogFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleRemoveExistingBlogImage = (imagePath) => {
    setBlogFormData(prev => ({ ...prev, imagesToRemove: [...prev.imagesToRemove, imagePath] }));
  };
  
  const toggleRemoveExistingBlogImage = (imagePath) => {
    setBlogFormData(prev => ({
      ...prev,
      imagesToRemove: prev.imagesToRemove.includes(imagePath)
        ? prev.imagesToRemove.filter(img => img !== imagePath)
        : [...prev.imagesToRemove, imagePath]
    }));
  };

  const createBlogPostHandler = async (e) => {
    e.preventDefault();
    setErrorBlogPosts(null);
    const formDataToSend = new FormData();
    formDataToSend.append('title', blogFormData.title);
    formDataToSend.append('content', blogFormData.content);
    formDataToSend.append('author', blogFormData.author);
    formDataToSend.append('tags', JSON.stringify(blogFormData.tags));
    formDataToSend.append('status', blogFormData.status);
    blogFormData.images.forEach(image => formDataToSend.append('images', image));

    try {
      const response = await fetch(`${API_BASE_URL}/blogposts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formDataToSend
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create blog post');
      setBlogPosts(prev => [data, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setIsBlogModalOpen(false);
      resetBlogForm();
    } catch (err) { setErrorBlogPosts(err.message); }
  };

  const updateBlogPostHandler = async (e) => {
    e.preventDefault();
    setErrorBlogPosts(null);
    const formDataToSend = new FormData();
    formDataToSend.append('title', blogFormData.title);
    formDataToSend.append('content', blogFormData.content);
    formDataToSend.append('author', blogFormData.author);
    formDataToSend.append('tags', JSON.stringify(blogFormData.tags));
    formDataToSend.append('status', blogFormData.status);
    blogFormData.images.forEach(image => formDataToSend.append('images', image));
    if (blogFormData.imagesToRemove.length > 0) {
      formDataToSend.append('removeImages', JSON.stringify(blogFormData.imagesToRemove));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/blogposts/${selectedBlogPost._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` },
        body: formDataToSend
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update blog post');
      setBlogPosts(prev => prev.map(p => p._id === data._id ? data : p).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setIsBlogModalOpen(false);
      resetBlogForm();
    } catch (err) { setErrorBlogPosts(err.message); }
  };

  const deleteBlogPostHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setErrorBlogPosts(null);
      try {
        const response = await fetch(`${API_BASE_URL}/blogposts/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete blog post');
        setBlogPosts(prev => prev.filter(p => p._id !== id));
      } catch (err) { setErrorBlogPosts(err.message); }
    }
  };

  const openBlogEditModal = (post) => {
    setSelectedBlogPost(post);
    setBlogFormData({
      title: post.title,
      content: post.content,
      author: post.author || 'Admin',
      tags: post.tags || [],
      status: post.status || 'draft',
      images: [],
      imagesToRemove: []
    });
    setBlogImagePreviewUrls([]);
    setBlogModalMode('edit');
    setIsBlogModalOpen(true);
  };

  const openBlogCreateModal = () => {
    resetBlogForm();
    setBlogModalMode('create');
    setIsBlogModalOpen(true);
  };

  const resetBlogForm = () => {
    blogImagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setBlogFormData(initialBlogFormData);
    setBlogImagePreviewUrls([]);
    setSelectedBlogPost(null);
    setErrorBlogPosts(null);
  };

  // --- Render Logic ---
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-full max-w-md p-8 space-y-8 bg-white/2 backdrop-blur-3xl border border-white/10 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-2 text-white/35">Please sign in to continue</p>
          </div>
          {generalError && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{generalError}</div>}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">Email address</label>
              <input id="email" name="email" type="email" required className="block w-full px-3 py-2 mt-1 border border-gray-600 bg-white/5 backdrop-blur-3xl  text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <input id="password" name="password" type="password" required className="block w-full px-3 py-2 mt-1 border border-gray-600 bg-white/5 backdrop-blur-3xl  text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <button type="submit" disabled={loadingLogin} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {loadingLogin ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-black border-b border-white/15">
          <h1 className="ml-4 text-lg font-medium">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-600 rounded-md hover:bg-indigo-700">
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {generalError && <div className="p-4 mb-4 text-sm text-red-100 bg-red-700 rounded-lg">{generalError}</div>}

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Projects Stats */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-500/20 rounded-full"><FaFolders className="w-6 h-6 text-indigo-400" /></div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-white/75">Total Projects</h2>
                  <p className="text-2xl font-semibold">{loadingProjects ? '...' : projects.length}</p>
                </div>
              </div>
            </div>

            {/* Blog Posts Stats */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-full"><FaNewspaper className="w-6 h-6 text-green-400" /></div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-white/75">Total Blog Posts</h2>
                  <p className="text-2xl font-semibold">{loadingBlogPosts ? '...' : blogPosts.length}</p>
                </div>
              </div>
            </div>

            {/* Add Project Button */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-medium text-white/75">Projects</h2>
                    <p className="text-lg font-semibold">Manage Projects</p>
                </div>
                <button onClick={openProjectCreateModal} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    New Project
                </button>
            </div>

            {/* Add Blog Post Button */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-medium text-white/75">Blog</h2>
                    <p className="text-lg font-semibold">Manage Posts</p>
                </div>
                <button onClick={openBlogCreateModal} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                    New Post
                </button>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Projects </h2>
            {errorProjects && <div className="p-4 mb-4 text-sm text-red-100 bg-red-700 rounded-lg">{errorProjects}</div>}
            {loadingProjects ? <p>Loading projects...</p> : projects.length === 0 && !errorProjects ? <p>No projects found.</p> : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div key={project._id} className="overflow-hidden bg-white/5 border border-white/10 rounded-lg shadow-sm">
                    <img src={project.image ? `${API_BASE_URL}/${project.image}` : `https://via.placeholder.com/300x160.png?text=${project.title}`} alt={project.title} className="object-cover w-full h-40" onError={(e) => e.target.src = `https://via.placeholder.com/300x160.png?text=No+Image`} />
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-medium">{project.title}</h3>
                      <p className="mb-3 text-sm text-white/75 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap mb-3 gap-1">
                        {project.technologies?.map((tech, i) => <span key={i} className="px-2 py-0.5 text-xs text-indigo-300 bg-indigo-700/30 rounded-full">{tech}</span>)}
                      </div>
                    </div>
                    <div className="flex p-4 bg-black/20 justify-end space-x-2">
                      <button onClick={() => openProjectEditModal(project)} className="px-3 py-3 text-sm text-white bg-white/10 hover:bg-white/5 rounded-lg w-1/2"> Edit</button>
                      <button onClick={() => deleteProjectHandler(project._id)} className="px-3 py-3 text-sm text-white bg-red-500 hover:bg-red-500/50 rounded-lg w-1/2">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blog Posts Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Blogs</h2>
            {errorBlogPosts && <div className="p-4 mb-4 text-sm text-red-100 bg-red-700 rounded-lg">{errorBlogPosts}</div>}
            {loadingBlogPosts ? <p>Loading blog posts...</p> : blogPosts.length === 0 && !errorBlogPosts ? <p>No blog posts found.</p> : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <div key={post._id} className="overflow-hidden bg-white/5 border border-white/10 rounded-lg shadow-sm">
                    <img src={post.image ? `${API_BASE_URL}/${post.image}` : `https://via.placeholder.com/300x160.png?text=${post.title}`} alt={post.title} className="object-cover w-full h-40" onError={(e) => e.target.src = `https://via.placeholder.com/300x160.png?text=No+Image`} />
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-medium">{post.title}</h3>
                      <p className="text-xs text-white/50 mb-1">By {post.author} - <span className={`capitalize px-1.5 py-0.5 rounded text-xs ${post.status === 'published' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>{post.status}</span></p>
                      <p className="mb-3 text-sm text-white/75 line-clamp-2">{post.content}</p>
                       <div className="flex flex-wrap mb-3 gap-1">
                        {post.tags?.map((tag, i) => <span key={i} className="px-2 py-0.5 text-xs text-green-300 bg-green-700/30 rounded-full">{tag}</span>)}
                      </div>
                    </div>
                    <div className="flex p-4 bg-black/20 justify-end space-x-2">
                      <button onClick={() => openBlogEditModal(post)} className="px-3 py-3 text-sm text-white bg-white/10 hover:bg-white/5 rounded-lg w-1/2"> Edit</button>
                      <button onClick={() => deleteBlogPostHandler(post._id)} className="px-3 py-3 text-sm text-white bg-red-500 hover:bg-red-500/50 rounded-lg w-1/2">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 bg-white/5 backdrop-blur-3xl  border border-white/20 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">{projectModalMode === 'create' ? 'Create New Project' : 'Edit Project'}</h2>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-white"><FaX /></button>
            </div>
            {errorProjects && <div className="p-3 mb-3 text-sm text-red-300 bg-red-700/30 rounded">{errorProjects}</div>}
            <form onSubmit={projectModalMode === 'create' ? createProjectHandler : updateProjectHandler}>
              {/* Common Form Fields for Projects */}
              <div className="mb-4">
                <label htmlFor="project-title" className="block mb-1 text-sm font-medium">Project Title</label>
                <input type="text" id="project-title" name="title" value={projectFormData.title} onChange={handleProjectInputChange} className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="project-description" className="block mb-1 text-sm font-medium">Description</label>
                <textarea id="project-description" name="description" value={projectFormData.description} onChange={handleProjectInputChange} rows="3" className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="project-technologies" className="block mb-1 text-sm font-medium">Technologies (comma-separated)</label>
                <input 
                  type="text" 
                  id="project-technologies" 
                  name="technologies" 
                  value={projectFormData.technologies.join(', ')} 
                  onChange={handleProjectTechInput} 
                  placeholder="React, Node.js, MongoDB"
                  className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500" 
                />
                {projectFormData.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {projectFormData.technologies.map((tech, index) => (
                      <span key={index} className="px-2 py-0.5 text-xs text-indigo-300 bg-indigo-700/30 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="project-images" className="block mb-1 text-sm font-medium">Project Images</label>
                <input type="file" id="project-images" name="images" onChange={handleProjectFileChange} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/30 file:text-indigo-300 hover:file:bg-indigo-400/30" accept="image/*" multiple />
                {projectImagePreviewUrls.length > 0 && <p className="mt-2 mb-1 text-xs">New images to upload:</p>}
                <div className="flex flex-wrap gap-2 mt-1">
                  {projectImagePreviewUrls.map((url, index) => (
                    <div key={`new-proj-${index}`} className="relative w-16 h-16"><img src={url} alt="Preview" className="object-cover w-full h-full rounded" /><button type="button" onClick={() => handleRemoveNewProjectImage(index)} className="absolute top-0 right-0 p-0.5 text-xs text-white bg-red-500 rounded-full leading-none"><FaX /></button></div>
                  ))}
                </div>
                {projectModalMode === 'edit' && selectedProject?.images?.length > 0 && <p className="mt-3 mb-1 text-xs">Current images:</p>}
                <div className="flex flex-wrap gap-2 mt-1">
                  {projectModalMode === 'edit' && selectedProject?.images?.map((image, index) => (
                    <div key={`curr-proj-${index}`} className="relative w-16 h-16">
                      <img src={`${API_BASE_URL}/${image}`} alt="Current" className={`object-cover w-full h-full rounded ${projectFormData.imagesToRemove.includes(image) ? 'opacity-30' : ''}`} />
                      <button type="button" onClick={() => toggleRemoveExistingProjectImage(image)} className={`absolute top-0 right-0 p-0.5 text-xs text-white rounded-full leading-none ${projectFormData.imagesToRemove.includes(image) ? 'bg-yellow-500' : 'bg-red-500'}`}>{projectFormData.imagesToRemove.includes(image) ? <FaPlus /> : <FaX />}</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{projectModalMode === 'create' ? 'Create Project' : 'Update Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Post Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 bg-white/5 backdrop-blur-3xl  border border-white/20 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">{blogModalMode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}</h2>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-white"><FaX /></button>
            </div>
            {errorBlogPosts && <div className="p-3 mb-3 text-sm text-red-300 bg-red-700/30 rounded">{errorBlogPosts}</div>}
            <form onSubmit={blogModalMode === 'create' ? createBlogPostHandler : updateBlogPostHandler}>
              <div className="mb-4">
                <label htmlFor="blog-title" className="block mb-1 text-sm font-medium">Title</label>
                <input type="text" id="blog-title" name="title" value={blogFormData.title} onChange={handleBlogInputChange} className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500" required />
              </div>
              <div className="mb-4">
                <label htmlFor="blog-content" className="block mb-1 text-sm font-medium">Content</label>
                <textarea id="blog-content" name="content" value={blogFormData.content} onChange={handleBlogInputChange} rows="5" className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500" required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="blog-author" className="block mb-1 text-sm font-medium">Author</label>
                  <input type="text" id="blog-author" name="author" value={blogFormData.author} onChange={handleBlogInputChange} className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                  <label htmlFor="blog-status" className="block mb-1 text-sm font-medium">Status</label>
                  <select id="blog-status" name="status" value={blogFormData.status} onChange={handleBlogInputChange} className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="blog-tags" className="block mb-1 text-sm font-medium">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  id="blog-tags" 
                  name="tags" 
                  value={blogFormData.tags.join(', ')} 
                  onChange={handleBlogTagsInput}
                  placeholder="programming, web development, tutorial" 
                  className="block w-full px-3 py-2 bg-white/5 backdrop-blur-3xl  border border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500" 
                />
                {blogFormData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {blogFormData.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 text-xs text-green-300 bg-green-700/30 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="blog-images" className="block mb-1 text-sm font-medium">Post Images (first will be featured)</label>
                <input type="file" id="blog-images" name="images" onChange={handleBlogFileChange} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/30 file:text-green-300 hover:file:bg-green-400/30" accept="image/*" multiple />
                {blogImagePreviewUrls.length > 0 && <p className="mt-2 mb-1 text-xs">New images to upload:</p>}
                <div className="flex flex-wrap gap-2 mt-1">
                  {blogImagePreviewUrls.map((url, index) => (
                    <div key={`new-blog-${index}`} className="relative w-16 h-16"><img src={url} alt="Preview" className="object-cover w-full h-full rounded" /><button type="button" onClick={() => handleRemoveNewBlogImage(index)} className="absolute top-0 right-0 p-0.5 text-xs text-white bg-red-500 rounded-full leading-none"><FaX /></button></div>
                  ))}
                </div>
                {blogModalMode === 'edit' && selectedBlogPost?.images?.length > 0 && <p className="mt-3 mb-1 text-xs">Current images:</p>}
                <div className="flex flex-wrap gap-2 mt-1">
                  {blogModalMode === 'edit' && selectedBlogPost?.images?.map((image, index) => (
                    <div key={`curr-blog-${index}`} className="relative w-16 h-16">
                      <img src={`${API_BASE_URL}/${image}`} alt="Current" className={`object-cover w-full h-full rounded ${blogFormData.imagesToRemove.includes(image) ? 'opacity-30' : ''}`} />
                      <button type="button" onClick={() => toggleRemoveExistingBlogImage(image)} className={`absolute top-0 right-0 p-0.5 text-xs text-white rounded-full leading-none ${blogFormData.imagesToRemove.includes(image) ? 'bg-yellow-500' : 'bg-red-500'}`}>{blogFormData.imagesToRemove.includes(image) ? <FaPlus /> : <FaX />}</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsBlogModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">{blogModalMode === 'create' ? 'Create Post' : 'Update Post'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;