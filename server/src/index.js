const http = require('http');
const app = require('./app.js');
const mongoose = require('mongoose');

const { loadPlanetData } = require('../models/planets.model');

require('dotenv').config();
const PORT = process.env.PORT || 5001

const server = http.createServer(app);

const MONGO_URL = process.env.MONGO_CONNECT_PASS;

mongoose.connection.once('open', () => {
    console.log("Mongo db connection ready");
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

(async() => {
    //IIFE to preload the data from the CSV file
    await mongoose.connect(MONGO_URL);
    await loadPlanetData();
})();


server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
});