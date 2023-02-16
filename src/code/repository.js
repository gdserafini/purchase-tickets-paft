import {prisma} from '../../prisma/prisma.js';
import { validator, validatorResponse } from './lib/error.js';
import logger from './lib/log.js';
 
//get data using prisma with any key:value
export const getPurchase = async function(key, value, unique=false){
    validator(key, value);
    logger.debug(`Purchase repository - getPurchase - params: ${key}, ${value}`);

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

};

//create using prisma with any valid data (body)
export const createPurchase = async function(data){
    validator(data);
    if(validatorResponse(data)) return null;
    logger.debug(`Purchase repository - createPurchase - params: ${data}`);

    return prisma.purchase.create({
        data: data
    });

};

//delete all user's purchases by userId
export const deletePurchase = async function(id){
    validator(id);
    logger.debug(`Purchase repository - deletePurchase - params: ${id}`);

    return prisma.purchase.deleteMany({
        where: {
            userId: id
        }
    });
};

export const deletePurchaseById = async function(id){
    validator(id);

    return prisma.purchase.delete({
        where: {
            id: id
        }
    });
}; 