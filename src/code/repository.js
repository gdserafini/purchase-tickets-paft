import {prisma} from '../../prisma/prisma.js';
import { validator, validatorResponse } from './lib/error.js';
import logger from './lib/log.js';

const mock = {
    id: 1,
    price: 100,
    ticketId: 1,
    userId: 1
}

//REFACTORING FUNCTIONS
const validAndDebug = function(...params){
    validator(...params);
    logger.debug({...params}, 'Purchase repository - getPrisma - params:');
    return;
};

const getPrisma = async function(callback, ...params){
    validAndDebug(...params);
    return callback(...params);
};

//

/**
 * get data using prisma with any key:value
 * 
 * @param {*} key name
 * @param {*} value value
 * @param {*} unique unique (true) or list
 * @returns prisma response
 */
export const getPurchase = async function(key, value, unique=false){
    if(unique) return mock;
    return [mock];

    return getPrisma(async () => {
        if(unique){
            return prisma.purchase.findUnique({
                where: { id: value}
            });
        };
    
        return prisma.purchase.findMany({
            where: {
                [key]: value
            }
        });
    }, key, value);
};

/**
 * create using prisma with any valid data (body)
 * 
 * @param {*} data obj to create
 * @returns prisma response
 */
export const createPurchase = async function(data){
    if(validatorResponse(data)) return null;
    return mock;

    return getPrisma(async () => {
        return prisma.purchase.create({
            data: data
        });
    }, data);
};

/**
 * delete all user's purchases by userId
 * 
 * @param {*} id user's id
 * @returns prisma response
 */
export const deletePurchase = async function(id){
    return {count: 1};

    return getPrisma( async () => {
        return prisma.purchase.deleteMany({
            where: {
                userId: id
            }
        });
    }, id);
};

/**
 * delete a specific purchase by id
 * 
 * @param {*} id purchase id
 * @returns prisma response
 */
export const deletePurchaseById = async function(id){
    return mock;

    return getPrisma(async () => {
        return prisma.purchase.delete({
            where: {
                id: id
            }
        });
    }, id);
}; 