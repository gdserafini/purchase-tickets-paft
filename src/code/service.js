import { ServerError, validator, validatorResponse 
    } from "./lib/error.js";
import { createPurchase, getPurchase, deletePurchase, deletePurchaseById 
    } from "./repository.js";
import logger from './lib/log.js';
import { newAxios } from "./lib/network.js";

//REFACTORING FUNCTIONS

/**
 * abstract the repository (layer down)
 * execute any function of repository and return the result (from prisma)
 */
const getRepository = async function(callback, ...params){
    validator(callback, ...params);

    const data = await callback(...params);

    //if return a empty list throws too;
    ServerError.throwIf(!data || data.length === 0, 'NotFound');

    return data;
};

/**
 * abstract the response
 * return 200 with any data from repository (executing the callback)
 * or catch a error
 */
const getResponse = async function(callback, ...params){
    try{
        validator(callback, ...params);
        logger.debug({callback, params}, 'Purchase service - getResponse - params:');

        const resp = {
            statusCode: 200,
            data: await getRepository(callback, ...params),
            message: 'Successfuly.'
        };
        logger.debug({resp}, 'Purchase service - getResponse - response:');
        return resp;
    }
    catch(error){
        logger.error({error}, 'Purchase service - getResponse - error:');
        return {
            statusCode: error['statusCode'],
            message: error['message']
        };
    };
};

//get any data from other service
const getData = async function(url){
    validator(url);
    return (await newAxios().get(url))['data']['data'];
};

//update any data from other service
const updateData = async function(url, data={}){
    validator(url);
    return (await newAxios().put(url, data))['data']['data'];
};

//

//SERVICE

/**
 * 
 * return the standard api response format
 * with the finded data
 * 
 * @param {*} key key name
 * @param {*} value value
 * @returns response json
 */
export const getPurchaseData = async function(key, value){
    return getResponse(getPurchase, key, value);
};

//REFACTORING TICKETS/CREDIT

const updateTicket = async function(urlGet, sum=false){
    const ticket = await getData(urlGet);

    if(sum) {
        const updated = await updateData(
            `http://localhost:3005/ticket/data/${ticket['id']}`,
            {
                amount: ticket['amount'] + 1
            });

        return ticket;
    };

    const updated = await updateData(
        `http://localhost:3005/ticket/data/${ticket['id']}`,
        {
            amount: ticket['amount'] - 1 < 0 ?
                0 : ticket['amount'] - 1
        });

    return ticket;
};

//update credit using ticket data
const updateCredit = async function(urlGet, ticket, sum=false){
    const credit = await getData(urlGet);

    if(sum){
        const updated = await updateData(
            `http://localhost:3003/credit/amount/${credit['id']}`,
            {
                credit: credit['credit'] - ticket['price'] < 0 ?
                    0 : credit['credit'] - ticket['price']
            });

        return updated;
    };
    
    const updated = await updateData(
        `http://localhost:3003/credit/amount/${credit['id']}`,
        {
            credit: credit['credit'] - ticket['price'] < 0 ?
                0 : credit['credit'] - ticket['price']
        });

    return updated;
};

//

//valid if can buy or not (user credit)
const validCredit = async function(showName, userId){
    const tick = await getData(
        `http://localhost:3005/ticket/data?show=${showName}`);
    const cred = await getData(
        `http://localhost:3003/credit/amount/${userId}`);

    ServerError.throwIf(cred['credit'] < tick['price'], 'Forbidden');
};

/**
 * return the created data
 * or throw a error
 * 
 * @param {*} data body
 * @returns response json
 */
export const createPurchaseData = async function(userId, showName){
    if(!userId || !showName) {
        return {
            statusCode: 400,
            message: `Bad request ${!userId ? showName : userId}.`
        };
    };

    try{
        //request in other services
        validCredit(showName, userId);

        const ticket = await updateTicket(
                `http://localhost:3005/ticket/data?show=${showName}`);

        const updated = await updateCredit(
            `http://localhost:3003/credit/amount/${userId}`, ticket);
        logger.debug({updated}, 'Purchase service - other service - response:');

        //this service
        return getResponse(createPurchase, {
            price: ticket['price'],
            ticketId: ticket['id'],
            userId: userId
        });
    }
    catch(error){
        logger.error({error}, 'Purchase service - createPurchaseData - error:');
        return {
            statusCode: error['statusCode'] ? error['statusCode'] : 500,
            message: error['message'] ? 
                error['message'] :'Internal server error.'
        };
    };
};

/**
 * 
 *  delete all purchases by userId
 * 
 * @param {*} id userId
 * @returns standart response or error
 */
export const deletePurchaseData = async function(id){
    if(!id || (await getPurchase('userId', id)).length === 0) return {
        statusCode: !id? 400 : 404,
        message: !id? 'Bad request' : 'Not found.'
    };

    return getResponse(deletePurchase, id);
};

const getPurch = async function(id){
    validator(id);
    const purch = await getPurchase('id', id, true);
    ServerError.throwIf(!purch, 'NotFound');
    return purch;
};

/**
 * delete a specific purchase by id
 * 
 * @param {*} id purchase id 
 * @returns stantar api response
 */
export const deletePurchaseDataById = async function(id){
    try{
        validator(id);

        const purch = await getPurch(id);

        const updated = await updateCredit(
            `http://localhost:3003/credit/amount/${purch['userId']}`,
            await updateTicket(
                `http://localhost:3005/ticket/data/${purch['ticketId']}`, true), true);
        logger.debug({updated}, 'Purchase service - other service - response:');

        return getResponse(deletePurchaseById, id);
    }
    catch(error){
        logger.error({error}, 'Purchase service - deletePurchaseDataById - error:');
        return {
            statusCode: error['statusCode'] ? error['statusCode'] : 500,
            message: error['message'] ? 
                error['message'] :'Internal server error.'
        };
    };
};

//