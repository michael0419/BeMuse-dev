import axios from 'axios';

import { baseURL } from './SpotifyEndpoints';
import { getData } from './storage/TokenStorage';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(async (req) => {
    const access_token = await getData('@access_token');
    req.headers.Authorization = `Bearer ${access_token}`;
    return req;
});

export default axiosInstance;