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

const data = require('./lib/data');

// app object - module scaffolding
const app = {};




// testing data create
// data.create('test', 'newfile', {"name": "Pavel", "age": 30}, (err) => {
//     console.log('Error was', err);
// });

// text data read
// data.read('test', 'newfile', (err, data) => {
//     console.log(data, err);
// });

// test data update
// data.update('test', 'newfile', {"name": "Pavel", "age": 35}, (err) => {
//     console.log('Error was', err);
// });

// test data delete
data.delete('test', 'newfile', (err) => {
    console.log('Error was', err);
});





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