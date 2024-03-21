/*
* Title: Routes
* Description: Application Routes
* Author: Pavel PArvej
* Date: 08/03/2024 
*/

// Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');


const routes = {
    sample: sampleHandler,
    users: userHandler,
}

module.exports = routes;