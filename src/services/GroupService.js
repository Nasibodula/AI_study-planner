// services/GroupService.js
import axios from 'axios';

const API_BASE_URL = '/api'; // Adjust based on your API setup

/**
 * Create a new study group
 * @param {Object} groupData Group information
 * @returns {Promise<Object>} Created group
 */
export const createGroup = async (groupData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/groups`, groupData);
    return response.data;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

/**
 * Get recommended groups for current user
 * @param {number} limit Max number of groups to return
 * @returns {Promise<Array>} List of recommended groups
 */
export const getRecommendedGroups = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/groups/recommended`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended groups:', error);
    return [];
  }
};

/**
 * Join a study group
 * @param {string} groupId Group ID to join
 * @returns {Promise<Object>} Result
 */
export const joinGroup = async (groupId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/groups/${groupId}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

/**
 * Track user study activity
 * @param {string} topic Topic being studied
 * @returns {Promise<Object>} Result
 */
export const trackStudyTopic = async (topic) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/study/track`, { topic });
    return response.data;
  } catch (error) {
    console.error('Error tracking study topic:', error);
    throw error;
  }
};