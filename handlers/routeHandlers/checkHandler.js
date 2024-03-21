const data = require('../../lib/data');
const {parseJSON, createRandomString} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        // do operation
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed!'
        });
    }
};

handler._check = {};

handler._check.get = (requestProperties, callback) => {
    // check the token if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    
    if(id) {
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                let check = parseJSON(checkData);
                let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;
                tokenHandler._token.verify(token, check.phone, (verify) => {
                    if(verify) {
                        callback(200, check);
                    } else {
                        callback(403, {
                            error: 'Authentication failed!'
                        }); 
                    }
                });
            } else {
                callback(400, {
                    error: 'Invalid check id!'
                }); 
            }
        });
    } else {
        callback(400, {
            error: 'Invalid check id!'
        });
    }
};

handler._check.post = (requestProperties, callback) => {
    // validate inputs
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;
        // get user phone by reading the token
        data.read('tokens', token, (err, tokenData) => {
            if(!err && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                // get user
                data.read('users', userPhone, (err, userData) => {
                    if(!err && userData) {
                        tokenHandler._token.verify(token, userPhone, (verify) => {
                            if(verify) {
                                let userObject = parseJSON(userData);
                                let userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                if (userChecks.length < maxChecks) {
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        id: checkId,
                                        phone: userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds
                                    };
                                    // save the check
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if(!err) {
                                            // add check id to user object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err) => {
                                                if(!err) {
                                                    callback(201, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error: 'Internal server error!'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'Internal server error!'
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'User already reached max check limit!'
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'Authentication failed!'
                                }); 
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authentication failed!'
                        }); 
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication failed!'
                }); 
            }
        });
    }
    
};

handler._check.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    
    if(id) {
        // validate inputs
        const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

        const url =
            typeof requestProperties.body.url === 'string' &&
            requestProperties.body.url.trim().length > 0
                ? requestProperties.body.url
                : false;

        const method =
            typeof requestProperties.body.method === 'string' &&
            ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
                ? requestProperties.body.method
                : false;

        const successCodes =
            typeof requestProperties.body.successCodes === 'object' &&
            requestProperties.body.successCodes instanceof Array
                ? requestProperties.body.successCodes
                : false;

        const timeoutSeconds =
            typeof requestProperties.body.timeoutSeconds === 'number' &&
            requestProperties.body.timeoutSeconds % 1 === 0 &&
            requestProperties.body.timeoutSeconds >= 1 &&
            requestProperties.body.timeoutSeconds <= 5
                ? requestProperties.body.timeoutSeconds
                : false;

        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (err, checkData) => {
                if(!err && checkData) {
                    let checkObject = parseJSON(checkData);
                    let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;
                    tokenHandler._token.verify(token, checkObject.phone, (verify) => {
                        if(verify) {
                            if(protocol) {
                                checkObject.protocol = protocol;
                            }
                            if(url) {
                                checkObject.url = url;
                            }
                            if(method) {
                                checkObject.method = method;
                            }
                            if(successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if(timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }

                            data.update('checks', id, checkObject, (err) => {
                                if(!err) {
                                    callback(201, checkObject);
                                } else {
                                    callback(500, {
                                        error: 'Internal server error!'
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: 'Authentication failed!'
                            }); 
                        }
                    });
                } else {
                    callback(500, {
                        error: 'Internal server error!'
                    });
                }
            });
        } else {
            callback(400, {
                error: 'Must provide atleast one field!'
            });
        }
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        });
    }
};

handler._check.delete = (requestProperties, callback) => {
    // check the token if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    
    if(id) {
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                let check = parseJSON(checkData);
                let token = typeof requestProperties.headerObject.token === 'string' ? requestProperties.headerObject.token : false;
                tokenHandler._token.verify(token, check.phone, (verify) => {
                    if(verify) {
                        data.delete('checks', id, (err) => {
                            if(!err) {
                                data.read('users', check.phone, (err, userData) => {
                                    if(!err && userData) {
                                        let userObject = parseJSON(userData);
                                        let userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                                        // get the index which we want to delete
                                        let checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);
                                            console.log('Updated', userChecks);
                                            // reset the user data
                                            userObject.checks = userChecks;
                                            data.update('users', check.phone, userObject, (err) => {
                                                if(!err) {
                                                    callback(201, {
                                                        message: "Check deleted successfully."
                                                    })
                                                } else {
                                                    callback(500, {
                                                        error: 'Internal server error!'
                                                    }); 
                                                }
                                            });

                                        } else {
                                            callback(500, {
                                                error: 'Internal server error!'
                                            }); 
                                        }
                                    } else {
                                        callback(500, {
                                            error: 'Internal server error!'
                                        });  
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: 'Internal server error!'
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'Authentication failed!'
                        }); 
                    }
                });
            } else {
                callback(400, {
                    error: 'Invalid check id!'
                }); 
            }
        });
    } else {
        callback(400, {
            error: 'Invalid check id!'
        });
    }
};



module.exports = handler;