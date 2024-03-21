/*
* Title: Initial file
* Description: Initial file to start the node srtver and workers
* Author: Pavel PArvej
* Date: 18/03/2024 
*/

// Dependencies
const server = require('./lib/server');
const workers = require('./lib/workers');

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    server.init();
    // start the workers
    workers.init();
};

app.init();

module.exports = app;