/*
* Title: Uptime Monitoring Application
* Description: A RESTFul API to monitor up or down time of user define links
* Author: Pavel PArvej
* Date: 08/03/2024 
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const env = require('./helpers/environments');

// app object - module scaffolding
const app = {};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(env.port, () => {
        console.log(`Listining to port ${env.port}`);
    })
}

// handle Request Response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();