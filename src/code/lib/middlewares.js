import logger from './log.js';
import jwt from 'jsonwebtoken';
import { errorJson, ServerError, validator} from "./error.js";

const SECRET = 'passwordticketauthserver';
const ISSUER = 'auth service';

//REFACTORING FUNCTIONS

//return statusCode and message from any type of error
const getError = function(res, error){
    validator(res, error);
    logger.error(`Purchase middleware - getError - params: ${error}`);

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
        logger.debug(
            `Purchase middleware - validMiddleware - params: 
            ${req.params.id} or ${req.body}`);

        return callback(req, next);
    }
    catch(error){
        return getError(res, error);
    };
};

const getToken = function(req){
    const {authorization} = req['headers'];
    logger.debug(`Purchase middleware - getToken - auth param: ${authorization}`);

    ServerError.throwIf(!authorization, 'Unauthorized');

    const [bearer, token] = authorization.split(" ");

    ServerError
        .throwIf(bearer !== 'Bearer', 'BadRequest');

    return token;
}

//

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

        jwt.verify(getToken(req), SECRET, (error, decoded) => {
            ServerError.throwIf(error, 'InternalError');

            req.userId = decoded.id;
            req.type = decoded.type;
            logger.debug(
                `Purchase middleware - JWT - decoded: ${req.userId}, ${req.type}`);
            
            return next();
        });
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