import request from 'supertest';
import app from '../../app.js';
import { createPurchase } from '../code/repository.js';

/**
 * if some tests failed, it could be that the token has expired (24h)
 * you can generate a new token in auth service
 */
describe('Integration tests - POST', () => {
    test('Should return 200 if successfuly.', async() => {

        const mock = {
            price: 999,
            ticketId: 1
        };

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6IkFETUlOIiwiaWF0IjoxNjc2NTAyODc5LCJleHAiOjE2NzY1ODkyNzl9.3z3QD23w0PLbiZk4S2dwHbMzhBFcLeMZLN04bu2pXEQ';
        const resp = await request(app).post('/purchase/me?show=show-test')
            .set('Authorization', `Bearer ${token}`)
            .send(mock);

        expect(resp['statusCode']).toBe(200);

    });

    test('Should return 400 if no body is passed.', async() => {

        const resp = await request(app).post('/purchase/me').send(null);
        expect(resp['statusCode']).toBe(400);
    });
    
    test('Should return 400 if invalid body is passed.', async() => {

        const resp = await request(app).post('/purchase/me').send({});
        expect(resp['statusCode']).toBe(400);
    });

    test('Should return 401 if is unauthorized.', async () => {

        const mock = {
            price: 99,
            ticketId: 1,
            userId: 3
        };

        const resp = await request(app).post('/purchase/me?show=show-test').send(mock);
        expect(resp['statusCode']).toBe(401);

    });
});

describe('Integration tests - GET', () => {

    test('Should return 200 if successfuly.', async() => {

        const resp = await request(app).get('/purchase/1');
        expect(resp['statusCode']).toBe(200);
    });

    test('Should return 400 if invalid id is passed.', async() => {

        const resp = await request(app).get('/purchase/-1');
        expect(resp['statusCode']).toBe(400);
    });

    test('Should return 404 if not found.', async() => {

        const resp = await request(app).get('/purchase/999');
        expect(resp['statusCode']).toBe(404);
    });

});

describe('Integration tests - DELETE', () => {
    test('Should return 200 if successfuly.', async() => {

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6IkFETUlOIiwiaWF0IjoxNjc2NTAyODc5LCJleHAiOjE2NzY1ODkyNzl9.3z3QD23w0PLbiZk4S2dwHbMzhBFcLeMZLN04bu2pXEQ';
        const resp = await request(app).delete('/purchase/me')
            .set('Authorization', `Bearer ${token}`);

        expect(resp['statusCode']).toBe(200);

    });


    test('Should return 403 if is unauthorized.', async () => {

        const resp = await request(app).delete('/purchase/me')
            .set('blablabla', 'no token');
        expect(resp['statusCode']).toBe(401);

    });

    test('Should return 400 if invalid id is passed.', async () => {
        
        const resp = await request(app).delete('/purchase/by-id/-1');
        expect(resp['statusCode']).toBe(400);

    });

    test('Should return 403 if is unauthorized.', async () => {

        const resp = await request(app).delete('/purchase/by-id/10000')
            .set('blablabla', 'no token');
        expect(resp['statusCode']).toBe(401);

    });

    test('Should return 200 if successfuly by id.', async() => {

        const created = await createPurchase({
            price: 100,
            userId: 3,
            ticketId: 4
        });

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6IkFETUlOIiwiaWF0IjoxNjc2NTAyODc5LCJleHAiOjE2NzY1ODkyNzl9.3z3QD23w0PLbiZk4S2dwHbMzhBFcLeMZLN04bu2pXEQ';
        const resp = await request(app).delete(`/purchase/by-id/${created['id']}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resp['statusCode']).toBe(200);

    });
});