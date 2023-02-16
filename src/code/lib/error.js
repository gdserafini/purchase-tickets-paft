
export class ServerError extends Error {
    statusCode;

    constructor(statusCode=500, message='Server error.'){
        super(message);
        this.statusCode = statusCode;
    };

    /**
     * trhow if condition
     * the builder get the error from errorSet
     */
    static throwIf(condition, builder='BadRequest'){
        if(condition) throw errorSet[builder];
        return ServerError;
    };
};

//refact error
const errorSet = {
    'BadRequest': new ServerError(400, 'Bad request.'),
    'Unauthorized': new ServerError(401, 'Unauthorized.'),
    'Forbidden': new ServerError(403, 'Forbidden.'),
    'NotFound': new ServerError(404, 'Not found.'),
    'InternalError': new ServerError(500, 'Internal server error.'),
};

/**
 * 
 * @param {*} error error to format
 * @returns api standard error format
 */
export const errorJson = function(error){
    return {
        statusCode: error['statusCode'],
        message: error['message']
    };
};

//VALIDATORS

/**
 * 
 * @param  {...any} params any params
 * @returns error 400
 */
export const validator = function(...params){
    if(!params) throw new ServerError(400, 'Bad request.');

    for(let p of params){
        if(!p) throw new ServerError(400, 'Bad request.');
    };
};

export const validatorResponse = function(data){
    return (!data || Object.keys(data).length === 0);
};

//