// src/services/papyrusService.js

const API_URL = 'https://9no3mc5byl.execute-api.us-east-1.amazonaws.com/prod';

const PROXY_URL = 'http://localhost:3001/papyrus'

export const createPapyrus = async (papyrusData) => {
  try {
    const response = await fetch(`${API_URL}/papyrus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(papyrusData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
