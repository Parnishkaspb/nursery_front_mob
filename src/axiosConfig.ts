import { ENDPOINTS } from './config/index';

import axios from 'axios';

const instance = axios.create({
    baseURL: ENDPOINTS.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export default instance;
