/*
* Title: Routes
* Description: Application Routes
* Author: Pavel PArvej
* Date: 08/03/2024 
*/

// Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');


const routes = {
    sample: sampleHandler
}

module.exports = routes;