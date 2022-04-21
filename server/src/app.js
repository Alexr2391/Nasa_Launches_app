const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const app = express();
const path = require('path');

const api = require('../routes/api')

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(morgan(
    'common'
))


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '..', '/public')));

app.use('/v1', api);

// /* in the route request to allow client-side routing
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})


module.exports = app;