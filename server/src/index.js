const http = require('http');
const app = require('./app.js');

const { loadPlanetData } = require('../models/planets.model');

require('dotenv').config();
const PORT = process.env.PORT || 5001

const server = http.createServer(app);

(async() => {
    await loadPlanetData();
})();


server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
});