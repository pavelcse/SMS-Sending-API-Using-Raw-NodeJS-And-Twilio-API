/*
* Title: Workers Library
* Description: Worker related files
* Author: Pavel PArvej
* Date: 18/03/2024 
*/

// Dependencies
const http = require('http');
const env = require('../helpers/environments');

// workers object - module scaffolding
const worker = {};




worker.init = () => {
    // Start the worker
    console.log('Worker are working...')
}

module.exports = worker;

