import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

console.log('Using API base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Function to get the auth token from local storage (or context/state management)
const getAuthToken = () => {
    return localStorage.getItem('authToken');
}

// Add Authorization header if token exists
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- Public API Calls ---
export const fetchProjects = async () => {
    try {
        console.log('Fetching projects from:', API_BASE_URL + '/projects');
        const response = await apiClient.get('/projects');
        
        // Check if the response is HTML (which would indicate an issue)
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
            console.error('Received HTML instead of JSON. Check your API configuration.');
            throw new Error('Invalid response format: Expected JSON but received HTML');
        }
        
        // Additional check for string responses that might be HTML
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
            console.error('Received HTML instead of JSON:', response.data.substring(0, 200));
            throw new Error('Invalid response format: Expected JSON but received HTML');
        }
        
        return response.data;
    } catch (error) {
        // Better error logging
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
            
            // For HTML responses, show part of the content to help diagnose
            if (error.response.headers['content-type']?.includes('text/html')) {
                console.error("HTML response preview:", 
                    typeof error.response.data === 'string' 
                        ? error.response.data.substring(0, 200) 
                        : 'Non-string response');
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
        }
        throw error;
    }
};

// Test function to check API connectivity
export const testApiConnection = async () => {
    try {
        // Try directly with fetch without using the proxy
        const response = await fetch(`${API_BASE_URL}/projects`);
        console.log('API test response status:', response.status);
        console.log('API test content type:', response.headers.get('content-type'));
        const text = await response.text();
        console.log('API test response text preview:', text.substring(0, 200));
        return {
            status: response.status,
            contentType: response.headers.get('content-type'),
            isHtml: text.includes('<!DOCTYPE html>'),
            textPreview: text.substring(0, 200)
        };
    } catch (error) {
        console.error('API connection test failed:', error);
        return { error: error.message };
    }
};

export const fetchExperiences = async () => {
    try {
        const response = await apiClient.get('/experience');
        return response.data;
    } catch (error) {
        console.error("Error fetching experiences:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchEducations = async () => {
     try {
        const response = await apiClient.get('/education');
        return response.data;
    } catch (error) {
        console.error("Error fetching educations:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchCertifications = async () => {
     try {
        const response = await apiClient.get('/certifications');
        return response.data;
    } catch (error) {
        console.error("Error fetching certifications:", error.response?.data || error.message);
        throw error;
    }
};

// --- Authentication API Calls ---
export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data && response.data.token) {
            localStorage.setItem('authToken', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
     localStorage.removeItem('authToken');
};

export const fetchCurrentUser = async () => {
     const token = getAuthToken();
     if (!token) return null;

     try {
        const response = await apiClient.get('/auth/me');
        return response.data.data;
     } catch (error) {
         console.error("Error fetching current user:", error.response?.data || error.message);
         if (error.response?.status === 401) {
             logout();
         }
         return null;
     }
};

// --- Protected API Calls ---
export const createProject = async (projectData) => {
    try {
        const response = await apiClient.post('/projects', projectData);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error.response?.data || error.message);
        throw error;
    }
};

export const updateProject = async (id, projectData) => {
    try {
        const response = await apiClient.put(`/projects/${id}`, projectData);
        return response.data;
    } catch (error) {
        console.error("Error updating project:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const response = await apiClient.delete(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting project:", error.response?.data || error.message);
        throw error;
    }
};


// --- Blog Post API Calls ---

// Fetch all published blog posts
export const fetchBlogPosts = async () => {
    try {
        console.log('Fetching blog posts from:', API_BASE_URL + '/blogposts');
        const response = await apiClient.get('/blogposts');
        // Add similar content type checks as in fetchProjects if needed
        return response.data;
    } catch (error) {
        console.error("Error fetching blog posts:", error.response?.data || error.message);
        throw error;
    }
};

// Fetch all blog posts including drafts (for admin panel)
export const fetchAllBlogPostsAdmin = async () => {
    try {
        const response = await apiClient.get('/blogposts/all'); // Requires auth
        return response.data;
    } catch (error) {
        console.error("Error fetching all blog posts (admin):", error.response?.data || error.message);
        throw error;
    }
};

// Fetch a single blog post by ID or slug
export const fetchBlogPostByIdentifier = async (identifier) => {
    try {
        const response = await apiClient.get(`/blogposts/${identifier}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching blog post ${identifier}:`, error.response?.data || error.message);
        throw error;
    }
};

// Create a blog post
// blogPostData should be FormData if including files
export const createBlogPost = async (blogPostData) => {
    try {
        // If sending files, headers should be 'multipart/form-data'
        // Axios usually sets this automatically if FormData is passed as data.
        const response = await apiClient.post('/blogposts', blogPostData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating blog post:", error.response?.data || error.message);
        throw error;
    }
};

// Update a blog post
// blogPostData should be FormData if including files
export const updateBlogPost = async (id, blogPostData) => {
    try {
        const response = await apiClient.put(`/blogposts/${id}`, blogPostData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error)
 {
        console.error("Error updating blog post:", error.response?.data || error.message);
        throw error;
    }
};

// Delete a blog post
export const deleteBlogPost = async (id) => {
    try {
        const response = await apiClient.delete(`/blogposts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting blog post:", error.response?.data || error.message);
        throw error;
    }
};