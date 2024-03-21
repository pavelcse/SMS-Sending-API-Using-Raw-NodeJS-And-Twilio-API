/*
* Title: Environment 
* Description: Environment File
* Author: Pavel PArvej
* Date: 08/03/2024 
*/

// app object - module scaffolding
const environments = {};

environments.staging = {
    port: 3001,
    envName: 'staging',
    secretKey: 'mynameispavel',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'mynameispavel',
    maxChecks: 5,
    twilio: {
        fromPhone: '',
        accountSid: '',
        authToken: '',
    },
};

//detiremine which envirnonment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding env object
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// export module
module.exports = environmentToExport;