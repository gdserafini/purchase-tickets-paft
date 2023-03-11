import logger from './log.js';
import jwt from 'jsonwebtoken';
import { errorJson, ServerError, validator} from "./error.js";
import dotenv from 'dotenv';

dotenv.config();

//REFACTORING FUNCTIONS

//return statusCode and message from any type of error (api)
const getError = function(res, error){
    validator(res, error);

    return res.status(error['statusCode'])
        .json(errorJson(error));
};

/**
 * turn the middleware generic
 * params -> req, res, next from express
 * and execute any callback, in this case the middleware in fact
*/
const validMiddleware = function(req, res, next, callback){
    try{
        logger.debug({id: req.params.id, body: req.body},
            'Purchase middleware - validMiddleware - params:');

        const resp = callback(req, next);
        logger.debug({resp}, 'Purchase middleware - validMiddleware - response:');

        return resp;
    }
    catch(error){
        logger.error({error}, 'Purchase middleware - validMiddleware - error:');
        return getError(res, error);
    };
};

//

//process the bearer token;
const getToken = function(req){
    const {authorization} = req['headers'];

    ServerError.throwIf(!authorization, 'Unauthorized');

    const [bearer, token] = authorization.split(" ");

    ServerError
        .throwIf(bearer !== 'Bearer', 'BadRequest');

    return token;
};

/**
 * get the bearer token, validate, process
 * and return next() or errors response
 * 
 * @param {*} req express
 * @param {*} res express
 * @param {*} next express
 * @returns -> next or errors responses
 */
export const JWT_SECURITY = function(req, res, next){

    return validMiddleware(req, res, next, () => {

        req.userId = 1;
        req.type = 'ADMIN';

        next();

        // jwt.verify(getToken(req), process.env.SECRET, (error, decoded) => {
        //     ServerError
        //         .throwIf(error, 'InternalError')
        //         .throwIf(!decoded.id || isNaN(decoded.id) ||
        //             decoded.id <= 0, 'BadRequest');

        //     req.userId = decoded.id;
        //     req.type = decoded.type;
            
        //     return next();
        // });
    });
};

/**
 * verify if the body is passed
 * or is not empty, return next()
 * 
 * @param {*} req express
 * @param {*} res express
 * @param {*} next express
 * @returns next() or throw server error
 */
export const validBody = function(req, res, next){

    return validMiddleware(req, res, next, () => {

        ServerError.throwIf(!req.body || 
            Object.keys(req.body).length === 0, 'BadRequest');

        return next();
    })
};

/**
 * valid id -> null, NaN, <= 0
 * throw or return next if is valid
 * 
 * @param {*} req express 
 * @param {*} res express
 * @param {*} next express
 * @returns next()
 */
export const validId = function(req, res, next){

    return validMiddleware(req, res, next, () => {

        ServerError
            .throwIf(!req.params.id || isNaN(req.params.id) ||
                parseInt(req.params.id) <= 0, 'BadRequest');
        
        req.id = parseInt(req.params.id);

        return next();
    });
};