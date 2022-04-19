const express = require('express');
const launchesRouter = express.Router();
const { 
    httpAddNewLaunch,
    httpGetAllLaunches, 
    httpAbortLaunch,
} = require('./launches.controller');


launchesRouter.get('/', httpGetAllLaunches)
              .post('/', httpAddNewLaunch)
              .delete('/:id', httpAbortLaunch);

module.exports = launchesRouter;