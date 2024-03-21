/*
* Title: Routes
* Description: Application Routes
* Author: Pavel PArvej
* Date: 08/03/2024 
*/

// Dependencies
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');
const {checkHandler} = require('./handlers/routeHandlers/checkHandler.js');


const routes = {
    users: userHandler,
    tokens: tokenHandler,
    checks: checkHandler,
}

module.exports = routes;