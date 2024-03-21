/*
* Title: Routes
* Description: Application Routes
* Author: Pavel PArvej
* Date: 08/03/2024 
*/

// Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');
const {checkHandler} = require('./handlers/routeHandlers/checkHandler.js');


const routes = {
    sample: sampleHandler,
    users: userHandler,
    tokens: tokenHandler,
    checks: checkHandler,
}

module.exports = routes;