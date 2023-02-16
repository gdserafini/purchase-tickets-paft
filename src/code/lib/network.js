import axios from 'axios';
import logger from './log.js';

/**
 * intercept (request) and return axios
 * 
 * @param {*} params any
 * @returns axios instance
 */
export const newAxios = function(params){
    const instance = axios.create();
    logger.debug({params}, 'Purchase network - newAxios - params:');

    instance.interceptors.request.use(r => {
        return r; 
    });
    logger.debug({instance}, 'Purchase network - newAxios - response:');

    return instance;
};