import {prisma} from '../../prisma/prisma.js';
import { validator, validatorResponse } from './lib/error.js';
import logger from './lib/log.js';
 
//get data using prisma with any key:value
export const getPurchase = async function(key, value, unique=false){
    validator(key, value);
    logger.debug({key, value}, 'Purchase repository - getPurchase - params:');

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
    logger.debug({data}, 'Purchase repository - createPurchase - params:');

    return prisma.purchase.create({
        data: data
    });

};

//delete all user's purchases by userId
export const deletePurchase = async function(id){
    validator(id);
    logger.debug({id}, 'Purchase repository - deletePurchase - params:');

    return prisma.purchase.deleteMany({
        where: {
            userId: id
        }
    });
};

export const deletePurchaseById = async function(id){
    validator(id);
    logger.debug({id}, 'Purchase repository - deletePurchaseById - params:');

    return prisma.purchase.delete({
        where: {
            id: id
        }
    });
}; 