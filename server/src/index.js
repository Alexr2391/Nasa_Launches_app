const http = require('http');
const app = require('./app.js');
const { mongoConnect } = require('./services/mongo') 

const { loadPlanetData } = require('../models/planets.model');

require('dotenv').config();
const PORT = process.env.PORT || 5001

const server = http.createServer(app);


(async() => {
    //IIFE to preload the data from the CSV file
    await mongoConnect();
    await loadPlanetData();
})();


server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
});