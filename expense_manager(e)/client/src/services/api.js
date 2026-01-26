const BASE_URL = 'http://localhost:3000/api';

// Helper to handle responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API Request Failed');
    }
    return response.json();
};

// GET
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return []; // Return empty array on fail to prevent crash
    }
};

// POST (Create)
export const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        throw error;
    }
};