/*
* Title: Server Library
* Description: Server related files
* Author: Pavel PArvej
* Date: 18/03/2024 
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('../helpers/handleReqRes');
const env = require('../helpers/environments');

// app object - module scaffolding
const server = {};

// create server
server.createServer = () => {
    const serverVariable = http.createServer(server.handleReqRes);
    serverVariable.listen(env.port, () => {
        console.log(`Listining to port ${env.port}`);
    })
}

// handle Request Response
server.handleReqRes = handleReqRes;


server.init = () => {
    // Start the server
    server.createServer();
}

module.exports = server;

