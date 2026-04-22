import axios from 'axios';

const apiBaseUrl =
  typeof window !== 'undefined' ? '/api' : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// import axios from 'axios';

// const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || '';

// export const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// import axios from 'axios';

// export const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
