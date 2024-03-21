const data = require('../../lib/data');
const {hash, parseJSON, createRandomString} = require('../../helpers/utilities');

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        // do operation
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed!'
        });
    }
};

handler._token = {};

handler._token.get = (requestProperties, callback) => {
    // check the token if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    if(id) {
        // lookup the data
        data.read('tokens', id, (err, token) => {
            const user = {...parseJSON(token)}
            if(!err && user) {
                callback(200, user);
            } else {
                callback(400, {
                    error: 'Requested token was not found!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'Requested token was not found!'
        });
    }
};

handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if(phone && password) {
        data.read('users', phone, (err, userData) => {
            if(!err && userData) {
                const user = {...parseJSON(userData) };
                const hashPassword = hash(password);
                if(hashPassword === user.password) {
                    let tokenId = createRandomString(20);
                    let expires = Date.now() + 60 * 60 * 1000;
                    let tokenObject = {
                        phone,
                        id: tokenId,
                        expires
                    };

                    // store token
                    data.create('tokens', tokenId, tokenObject, (err) => {
                        if(!err) {
                            callback(201, tokenObject);
                        } else {
                            callback(500, {
                                error: 'Internal server error!'
                            });
                        }
                    })
                } else {
                    callback(400, {
                        error: 'Password is not valid!'
                    });
                }
            } else {
                callback(400, {
                    error: 'You have a problem in your request!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        });
    }
};

handler._token.put = (requestProperties, callback) => {
    const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 20
        ? requestProperties.body.id
        : false;

    const extend =
    typeof requestProperties.body.extend === 'boolean' &&
    requestProperties.body.extend === true
        ? requestProperties.body.extend
        : false;
    
    if(id && extend) {
        data.read('tokens', id, (err, tokenData) => {
            const token = {...parseJSON(tokenData) };
            if(token.expires > Date.now()) {
                token.expires = Date.now() + 60 * 60 * 1000;

                data.update('tokens', id, token, (err) => {
                    if(!err) {
                        callback(201, token);
                    } else {
                        callback(400, {
                            error: 'Internal server error!'
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Token already expired!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'There was a problem in your request!'
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    // check the token if valid
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
            ? requestProperties.queryStringObject.id
            : false;
    
    if(id) {
        data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData) {
                data.delete('tokens', id, (err) => {
                    if(!err) {
                        callback(200, {
                            message: 'Token deleted successfully.'
                        });
                    } else {
                        callback(400, {
                            error: 'Requested token not found!'
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Requested token not found!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'Requested token not found!'
        });
    }
};

handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData) {
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
}



module.exports = handler;