// // src/services/authService.js
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

// export const authService = {
//   async login(email, password) {
//     try {
//       const response = await axios.post(`${API_URL}/login`, { email, password });
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || 'Login failed';
//     }
//   },

//   async register(name, email, password) {
//     try {
//       const response = await axios.post(`${API_URL}/register`, { 
//         name, 
//         email, 
//         password 
//       });
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//       }
//       return response.data;
//     } catch (error) {
//       throw error.response?.data?.message || 'Registration failed';
//     }
//   },

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   },

//   getCurrentUser() {
//     return JSON.parse(localStorage.getItem('user'));
//   },

//   getToken() {
//     return localStorage.getItem('token');
//   },

//   isAuthenticated() {
//     return !!this.getToken();
//   }
// };


// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userId', response.data.user.id);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  async register(name, email, password) {
    try {
      const response = await axios.post(`${API_URL}/register`, { 
        name, 
        email, 
        password 
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userId', response.data.user.id);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  },

  getCurrentUser() {
    // Get user from localStorage if possible
    const userId = localStorage.getItem('userId');
    
    try {
      // You might have the user object stored as well
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Ensure userId is set
        if (user && !localStorage.getItem('userId')) {
          localStorage.setItem('userId', user.id);
        }
        return user;
      }
      
      // If we at least have a userId, return a minimal user object
      if (userId) {
        return { id: userId };
      }
      
      return null;
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};