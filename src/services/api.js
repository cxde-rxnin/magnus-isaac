import axios from 'axios';

// Use relative path '/api' because of Vite proxy setup.
// In production build, you might need to configure the base URL differently
// depending on how you deploy frontend and backend.
const API_BASE_URL = 'api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Function to get the auth token from local storage (or context/state management)
const getAuthToken = () => {
    return localStorage.getItem('authToken'); // Example: storing token in localStorage
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
        console.log('Fetching projects from:', `${API_BASE_URL}/projects`);
        const response = await apiClient.get('/projects');
        
        // Check if the response is HTML (which would indicate an issue)
        const contentType = response.headers['content-type'];
        if (contentType && contentType.includes('text/html')) {
            console.error('Received HTML instead of JSON. Check your API proxy configuration.');
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
        // Try directly with fetch instead of axios to isolate issues
        const response = await fetch(`${window.location.origin}/api/projects`);
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
            localStorage.setItem('authToken', response.data.token); // Store token
        }
        return response.data; // Contains token and user info
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
     localStorage.removeItem('authToken'); // Clear token on logout
};

export const fetchCurrentUser = async () => {
     const token = getAuthToken();
     if (!token) return null; // No token, not logged in

     try {
        const response = await apiClient.get('/auth/me');
        return response.data.data; // The user object
     } catch (error) {
         console.error("Error fetching current user:", error.response?.data || error.message);
         // If token is invalid/expired (401), logout might be appropriate
         if (error.response?.status === 401) {
             logout();
         }
         return null;
     }
};

// --- Protected API Calls (Examples) ---
// Add functions for POST, PUT, DELETE for projects, experience etc.
// These will automatically include the token due to the interceptor.

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

// Add similar functions for deleteProject, createExperience, updateExperience, etc.