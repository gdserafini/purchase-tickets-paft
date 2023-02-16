import express from 'express';
import { errorJson } from './lib/error.js';
import { getPurchaseData, createPurchaseData, deletePurchaseData, deletePurchaseDataById
    } from './service.js';
import { validator, ServerError } from './lib/error.js';
import logger from '../code/lib/log.js';
import {JWT_SECURITY, validBody, validId} from './lib/middlewares.js';

const router = express.Router();

//REFACTORING FUNCTIONS


//abstract the error to send in the standard api format
const getError = function(res, error){
    validator(res, error);

    return res.status(error['statusCode'])
        .json(errorJson(error));
};

/**
 * abstract the service (layer down)
 * execute any function from service (callback) with their params
 * get the response from service or throws
 */
const getService = async function(callback, ...params){
    validator(callback, ...params);
    logger.debug({params}, 'Purchase router - getService - params:');

    const response = await callback(...params);
    
    ServerError.throwIf(!response, 'InternalError');

    return response;
};

/**
 * return any response to standard format or throws
 * callback -> from service (callback)
 */
const getResponse = function(res, response){
    try{
        validator(res, response);

        ServerError.throwIf(!response['statusCode'] ||
            !response['message'], 'BadRequest');

        logger.info({response}, 'Purchase router - getResponse - response:'); 
        return res.status(response['statusCode'])
            .json(response);
    }
    catch(error){
        logger.error({error}, 'Purchase router - getResponse - error:');
        return getError(res, error);
    }
};

//

//ROUTES

/**
 * get -> middleware, funciotn with express params
 * return standard api response format or error
 */
router.get('/:id', validId, async (req, res) => {

    return getResponse(res, 
        await getService(getPurchaseData, 
            'userId', parseInt(req.params.id)));
});

/**
 * post -> middleware, funciotn with express params
 * return standard api response format or error
 */
router.post('/me', validBody, JWT_SECURITY, async (req, res) => {

    const {show} = req.query;

    return getResponse(res, 
        await getService(createPurchaseData, req.userId, show));
});

/**
 * delete -> middleware id with express params
 * return standard api response format or error
 */
router.delete('/me', JWT_SECURITY, async (req, res) => {
    
    return getResponse(res,
        await getService(deletePurchaseData, req.userId));

});

router.delete('/by-id/:id', validId, JWT_SECURITY, async (req, res) => {

    return getResponse(res,
        await getService(deletePurchaseDataById, req.id));

});

//

export default router;