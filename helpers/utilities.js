const crypto = require('crypto');
const env = require('./environments');

const utilities = {};

// parse json string to boject
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }
    return output;
};

// hash string
utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', env.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// Create random string
utilities.createRandomString = (strlen) => {
    let length = typeof strlen === 'number' && strlen > 0 ? strlen : false;

    if (length) {
        const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possiblecharacters.charAt(
                Math.floor(Math.random() * possiblecharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};

module.exports = utilities;