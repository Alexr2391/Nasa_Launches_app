const { 
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
 } = require('../../models/launches.model');

function httpGetAllLaunches(get, res) {
    return res.status(200).json(getAllLaunches());
};

function httpAddNewLaunch(req, res) {
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

    addNewLaunch(launch);

    return res.status(201).json(launch);
};


function httpAbortLaunch(req, res) {

    const launchId = +req.params.id;

    if(!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    };

    const aborted = abortLaunchById(launchId); 
    
    return res.status(200).json(aborted);
};

module.exports = {
    httpGetAllLaunches, 
    httpAddNewLaunch,
    httpAbortLaunch,
};