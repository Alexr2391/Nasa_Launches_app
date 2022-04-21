const { 
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
 } = require('../../models/launches.model');

async function httpGetAllLaunches(get, res) {
    return res.status(200).json(await getAllLaunches());
};

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    
    const {
        mission, 
        rocket, 
        launchDate, 
        target
    } = launch;

    if(
        !mission ||
        !rocket ||
        !launchDate ||  
        !target
        ) {
            return res.status(400).json({
                error: 'Mission required launched property'
            });
    };

    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid Launch Date"
        });
    };

    await scheduleNewLaunch(launch);


    return res.status(201).json(launch);
};


async function httpAbortLaunch(req, res) {

    const launchId = +req.params.id;

    const existsLaunch = await existsLaunchWithId(launchId);

    if(!existsLaunch) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    };

    const aborted = await abortLaunchById(launchId); 

    if(!aborted) {
        return res.status(400).json({
            error: `Launch not aborted`,
        });
    }
    
    return res.status(200).json({
        ok : true,
    });
};

module.exports = {
    httpGetAllLaunches, 
    httpAddNewLaunch,
    httpAbortLaunch,
};