const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');
require('dotenv').config()

const DEFAULT_FLIGHT_NUMBER  = 100;

const launch = {
    flightNumber: DEFAULT_FLIGHT_NUMBER, //flight_number
    mission: 'Kepler exploration X', //name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), //date_local
    target: 'Kepler-442 b', //not applicable
    customers: ['ZTM', 'NASA'], //payload.customers for each payload
    upcoming: true, //upcoming
    success: true, //success
};

saveLaunch(launch);


async function populateLaunches() {
    const response = await axios.post(process.env.SPACEX_API_URL,{
        query: {},
       
        options: {
            pagination: false,
            populate: [
                {
                    path : 'rocket', 
                    select: {
                        name: 1, 
                    },
                },
                {
                    path: 'payloads', 
                    select: {
                        customers: 1
                    }
                },
            ],
        }
    });

    if(response.status !== 200) {
        console.log('Could not retrieve data');
        throw new Error('Launch data download failed');
    };

    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];

        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber : launchDoc['flight_number'],
            mission: launchDoc['name'], 
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'], 
            success: launchDoc['success'],
            customers: customers,
        };

        await saveLaunch(launch)
    };
};

async function loadLaunchesData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1, 
        rocket: 'Falcon1', 
        mission: 'FalconSat'
    });

    if(firstLaunch) {
        console.log('Launch data already loaded !');
    } else {
       await populateLaunches();
    }
};


async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
};


async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
};



async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');

        console.log(latestLaunch)
        if(!latestLaunch) {
            return DEFAULT_FLIGHT_NUMBER;
        }

        return latestLaunch.flightNumber;
};

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
    "_id": 0, "__v": 0,
    });
};

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber, 
        },
            launch, 
        {
            upsert: true
        }    
    );
};

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        kepler_name: launch.target,
    });

    if(!planet) {
        throw new Error('No matching planet was found');
    };

    const newFlightNumber  =  await getLatestFlightNumber();
        const newLaunch = Object.assign(launch, {
            flightNumber : newFlightNumber + 1, 
            customers: ['NASA'], 
            upcoming: true, 
            success: true,
        });

        await saveLaunch(newLaunch);
};



async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId, 
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
};

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchesData,
};