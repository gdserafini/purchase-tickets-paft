import {PrismaClient} from '@prisma/client';
import logger from '../src/code/lib/log.js';

export const prisma = new PrismaClient();

export const bootstrapDbPurchase = async function(){
    logger.debug('Checking initial data...');
    
    const exists = await prisma.purchase.findUnique({
        where: {
            id: 1
        }
    });

    if(!exists) {
        await prisma.purchase.create({
            data: {
                price: 100.00,
                ticketId: 1,
                userId: 1
            }
        })
    };

    logger.debug('Done.'); 
};
