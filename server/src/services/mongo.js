const mongoose = require('mongoose');
require('dotenv').config()

const MONGO_URL = process.env.MONGO_CONNECT_PASS;


mongoose.connection.once('open', () => {
    console.log("Mongo db connection ready");
});

mongoose.connection.on('error', (err) => {
    console.log(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
};


async function mongoDisconnect() {
    await mongoose.disconnect();
};

module.exports = {
    mongoConnect,
    mongoDisconnect,
};