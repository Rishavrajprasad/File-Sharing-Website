// src/services/shortenURL.js
import axios from 'axios';
const BITLY_API_URL = 'https://api-ssl.bitly.com/v4/shorten';
const BITLY_ACCESS_TOKEN = import.meta.env.VITE_BITLY_ACCESS_TOKEN;

export const shortenURL = async (longUrl) => {
  try {
    const response = await axios.post(
      BITLY_API_URL,
      {
        long_url: longUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.link;
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
};
