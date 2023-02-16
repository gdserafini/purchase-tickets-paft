import axios from 'axios';
import { ServerError } from './error.js';
import logger from './log.js';

export const newAxios = function(params){
    const instance = axios.create();

    instance.interceptors.request.use(r => {
        logger.debug({axiosResquest: r});
        return r; 
    });

    return instance;
};