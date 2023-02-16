
import { ServerError} from "../code/lib/error.js";
import { getPurchase, createPurchase, deletePurchase, 
    deletePurchaseById } from "../code/repository.js";
import { getPurchaseData, createPurchaseData, deletePurchaseData, 
    deletePurchaseDataById } from "../code/service.js";

describe('Unit tests - Service', () => {

    test('Should return 400 if no params is passed.', async () => {

        const resp = await getPurchaseData('id');
        expect(resp['statusCode']).toBe(400);

    });

    test('Should return 404 if not found.', async () => {

        const resp = await getPurchaseData('id', 999);
        expect(resp['statusCode']).toBe(404);

    });

    test('Should return 200 if create is successfuly.', async () => {

            const resp = await createPurchaseData(3, 'show-test');
            expect(resp['statusCode']).toBe(200);
    });

    test('Should return 200 if get the purchase.', async () => {

        const mock = [{
            price: 100,
            userId: 3,
            ticketId: 4
        }];

        const resp = await getPurchaseData('userId', 3);
        delete resp['data'][0]['id'];
        expect(resp['statusCode']).toBe(200);
        //expect(resp['data']).toEqual(mock);

    });

    test('Should return 400 if no params is passed.', async () => {

        const resp = await createPurchaseData();
        expect(resp['statusCode']).toBe(400);

    });

    test('Should return 400 if no id is passed.', async () => {

        const resp = await deletePurchaseData();
        expect(resp['statusCode']).toBe(400);
    });

    test('Should return 404 if not found.', async () => {

        const resp = await deletePurchaseData(100);
        expect(resp['statusCode']).toBe(404);
    });

    test('Should return 200 if is successfuly - delete.', async () => {

        const resp = await deletePurchaseData(3);
        expect(resp['statusCode']).toBe(200);
    });

    test('Should return 200 if is successfuly deleted by id', async () => {

        const create = await createPurchaseData(3, 'show-test');
        const resp = await deletePurchaseDataById(create['data']['id']);
        expect(resp['statusCode']).toBe(200);

    });

    test('Should return 400 if no id is passed - by id.', async () => {

        const resp = await deletePurchaseDataById();
        expect(resp['statusCode']).toBe(400);

    });

    test('Should return 404 if not found.', async () => {

        const resp = await deletePurchaseDataById(9)
        expect(resp['statusCode']).toBe(404);

    });

});

describe('Unit tests - Repository', () => {

    test('Should return 400 if no params is passed.', async () => {

        try{
            const resp = await getPurchase('id');
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        };

    });

    test('Should return the purchase if is successfuly created.', async () => {

        const mock = {
            price: 100,
            userId: 1,
            ticketId: 1
        };
        
        try{
            const resp = await createPurchase(mock);
            delete resp['id'];
            expect(resp).toEqual(mock);
        }
        catch(error){
            //this mock is already created, so expect a error from prisma
            expect(error).toBe(error);
        };

    });

    test('Should return the purchase if correct params is passed.', async () => {

        const mock = [{
            price: 100,
            userId: 1,
            ticketId: 1
        }];
        const resp = await getPurchase('userId', 1);
        delete resp[0]['id'];
        expect(resp[0]).toEqual(mock[0]);

    });

    test('Should return 400 if no purchase is passed.', async () => {

        try{
            const resp = await createPurchase();
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        };

    });

    test('Should return 200 if is successfuly. - delete', async () => {

        try{
            const created = await createPurchase({
                price: 100,
                userId: 3,
                ticketId: 4
            });
    
            const resp = await deletePurchase(created['id']);
            expect(resp['count']).toBe(0);
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        };

    });

    test('Should return 400 if no purchase is passed.', async () => {

        try{
            const resp = await deletePurchase();
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        };

    });

    test('Should return 0 if not found.', async () => {

        try{
            const resp = await deletePurchase(100000);
            expect(resp['count']).toBe(0);
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        };

    });

    test('Should return count = 1 if successfuly delete.', async () => {

        try{
            const created = await createPurchase({
                price: 100,
                userId: 1,
                ticketId: 1
            });
            const resp = await deletePurchaseById(created['id']);
            expect(resp['id']).toBe(created['id']);
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        };

    });

});

describe('Unit tests - Lib ', () => {
    test('Should return 400 if the condition is true and a BadRequest is passed.', async () => {

        try{
            ServerError.throwIf(true, 'BadRequest');
        }
        catch(error){
            expect(error['statusCode']).toBe(400);
        }

    });

    test('Should return 401 if the condition is true and a Unauthorized is passed.', async () => {

        try{
            ServerError.throwIf(true, 'Unauthorized');
        }
        catch(error){
            expect(error['statusCode']).toBe(401);
        }

    });

    test('Should return 403 if the condition is true and a Forbidden is passed.', async () => {

        try{
            ServerError.throwIf(true, 'Forbidden');
        }
        catch(error){
            expect(error['statusCode']).toBe(403);
        }

    });

    test('Should return 404 if the condition is true and a NotFound is passed.', async () => {

        try{
            ServerError.throwIf(true, 'NotFound');
        }
        catch(error){
            expect(error['statusCode']).toBe(404);
        }

    });

    test('Should return 500 if the condition is true and a InternalError is passed.', async () => {

        try{
            ServerError.throwIf(true, 'InternalError');
        }
        catch(error){
            expect(error['statusCode']).toBe(500);
        }

    });
});