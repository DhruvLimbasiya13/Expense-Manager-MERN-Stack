const BASE_URL = 'http://localhost:3000/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API Request Failed');
    }
    return response.json();
};

// GET Request
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return []; // Return empty array to prevent crashes
    }
};

// POST Request (Login, Register, Add Data)
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
}
// PUT Request (Update Data)
export const putData = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
        throw error;
    }
};

// DELETE Request
export const deleteData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
    }
}
