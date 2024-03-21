/*
* Title: Workers Library
* Description: Worker related files
* Author: Pavel PArvej
* Date: 18/03/2024 
*/

// Dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const {parseJSON} = require('../helpers/utilities');
const { sendTwilioSms } = require('../helpers/notifications');

// workers object - module scaffolding
const worker = {};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    let originalData = originalCheckData;
    if(originalCheckData && originalCheckData.id) {
        originalData.state =
            typeof originalCheckData.state === 'string' &&
            ['up', 'down'].indexOf(originalCheckData.state) > -1
                ? originalCheckData.state
                : 'down';

        originalData.lastChecked =
            typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;

        // pass to the next process
        worker.performCheck(originalData);
    } else {
        console.log('Error: Invalid check!');
    }
};

// perform check
worker.performCheck = (originalData) => {
    // prepare the initial check outcome
    let checkOutcome = {
        error: false,
        responseCode: false
    };

    // mark the outcome has not been sent yet
    let outcomeSent = false;

    // parse the host name and full url from the original name
    const parseUrl = url.parse(`${originalData.protocol}://${originalData.url}`, true);
    const hostName = parseUrl.hostname;
    const path = parseUrl.path;

    //constuct the request
    const requestDetails = {
        protocol: `${originalData.protocol}:`,
        hostname: hostName,
        mathod: originalData.method.toUpperCase(),
        path,
        timeout: originalData.timeoutSeconds * 1000
    };

    const protocolToUse = originalData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(requestDetails, (res) => {
        // grab the status of the response
        const status = res.statusCode;

        // update the check outcome and pass to the next process
        checkOutcome.responseCode = status;
        if(!outcomeSent) {
            worker.processCheckOutCome(originalData, checkOutcome);
            outcomeSent = true;
        }
    });

    // get the error event
    req.on('error', (e) => {
        checkOutcome = {
            error: true,
            message: e
        }

        if(!outcomeSent) {
            worker.processCheckOutCome(originalData, checkOutcome);
            outcomeSent = true;
        }
    });

    // get the timeout event
    req.on('timeout', (e) => {
        checkOutcome = {
            error: true,
            message: 'Timeout failed!'
        }
        if(!outcomeSent) {
            worker.processCheckOutCome(originalData, checkOutcome);
            outcomeSent = true;
        }
    });

    // send the request
    req.end();
};

worker.processCheckOutCome = (originalCheckData, checkOutCome) => {
    const state =
        !checkOutCome.error &&
        checkOutCome.responseCode &&
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
            ? 'up'
            : 'down';

    // decide whether we should alert the user or not
    const alertWanted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    // update the check data
    let newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if(!err) {
            if(alertWanted) {
                // send the checkdata to next process
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed as there is no state change');
            }
        } else {
            console.log('Error trying to save the check data of one of the check!');
        }
    });
};

// sent notification to user
worker.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

    sendTwilioSms(newCheckData.phone, msg, (err) => {
        if (!err) {
            console.log(`User was alerted to a status change via SMS: ${msg}`);
        } else {
            console.log(err);
        }
    });
};

// lookup all the check from database
worker.gatherAllChecks = () => {
    data.list('checks', (err, checks) => {
        if(!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // read the check data
                data.read('checks', check, (err, originalCheckData) => {
                    if(!err && originalCheckData) {
                        // pass the data to the check validator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: Reading one of the check data');
                    }
                });
            });
        } else {
            console.log('Error: Could not find any checks to process!');
        }
    });
};

// timer to execute the worker process once per munute
worker.loop = () => {
    setInterval(()=> {
        worker.gatherAllChecks();  
    }, 8000); // 1000 * 60
};


worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
    
}

module.exports = worker;

