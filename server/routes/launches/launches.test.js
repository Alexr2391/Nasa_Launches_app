const request = require('supertest');
const app = require('../../src/app');
const { 
    mongoConnect, 
    mongoDisconnect } = require('../../src/services/mongo')


describe('Launches API', () => {

    beforeAll(async() => {
        await mongoConnect();
    });

    afterAll(async()=> {
        await mongoDisconnect();
    });

    describe("Test GET / lauches", () => {

        test('Should response with 200 success',async() => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
    
            expect(response.statusCode).toBe(200);
        });
    });
    
    describe('Test POST /Launch', () => {
    
        const completeLaunchData = {
            mission: 'USS enterpise', 
            rocket: 'NCC 1701', 
            target: 'Kepler-62 f', 
            launchDate : 'January 4, 2040',
        };
        
        const launchDateWithoutData = {
            mission: 'USS enterpise', 
            rocket: 'NCC 1701', 
            target: 'Kepler-62 f', 
        };
        
        const launchDateWithInvalidDate = {
            mission: 'USS enterpise', 
            rocket: 'NCC 1701', 
            target: 'Kepler-62 f', 
            launchDate : 'zoot',
        };


        test('Should response with 201 created', async() => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
    
                const requestDate = new Date(completeLaunchData.launchDate).valueOf();
                const responseDate =new Date(response.body.launchDate).valueOf();
                
                expect(responseDate).toBe(requestDate);
    
                expect(response.body).toMatchObject(
                    launchDateWithoutData
                );
        });
        test('It should catch missing required properties', async() => {
    
            const response = await request(app)
                .post('/launches')
                .send(launchDateWithoutData)
                .expect('Content-Type', /json/)
                .expect(400);
    
                expect(response.body).toStrictEqual({
                    error: 'Mission required launched property'
                });
        });
        test('It should also catch invalid dates', async() => {
            const response = await request(app)
                .post('/launches')
                .send(launchDateWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
                expect(response.body).toStrictEqual({
                    error: "Invalid Launch Date"
                });
        });
    });
})


