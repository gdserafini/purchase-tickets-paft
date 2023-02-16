import axios from 'axios';
import { ServerError } from './error.js';
import logger from './log.js';

export const newAxios = function(params){
    const instance = axios.create();
    logger.debug({params}, 'Purchase network - newAxios - params:');

    instance.interceptors.request.use(r => {
        return r; 
    });
    logger.debug({instance}, 'Purchase network - newAxios - response:');

    return instance;
};