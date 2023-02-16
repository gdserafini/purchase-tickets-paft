import {prisma} from '../../prisma/prisma.js';
import { validator, validatorResponse } from './lib/error.js';
import logger from './lib/log.js';

const validAndDebug = function(...params){
    validator(...params);
    logger.debug({...params}, 'Purchase repository - getPrisma - params:');
    return;
};

const getPrisma = async function(callback, ...params){
    validAndDebug(...params);
    return callback(...params);
};
 
//get data using prisma with any key:value
export const getPurchase = async function(key, value, unique=false){
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

//create using prisma with any valid data (body)
export const createPurchase = async function(data){
    if(validatorResponse(data)) return null;

    return getPrisma(async () => {
        return prisma.purchase.create({
            data: data
        });
    }, data);
};

//delete all user's purchases by userId
export const deletePurchase = async function(id){
    return getPrisma( async () => {
        return prisma.purchase.deleteMany({
            where: {
                userId: id
            }
        });
    }, id);
};

export const deletePurchaseById = async function(id){
    return getPrisma(async () => {
        return prisma.purchase.delete({
            where: {
                id: id
            }
        });
    }, id);
}; 