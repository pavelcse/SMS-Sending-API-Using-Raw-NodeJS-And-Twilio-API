const data = require('../../lib/data');
const {hash, parseJSON} = require('../../helpers/utilities');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        // do operation
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed!'
        });
    }
};

handler._user = {};

handler._user.get = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if(phone) {
        // lookup the data
        data.read('users', phone, (err, usr) => {
            const user = {...parseJSON(usr)}
            if(!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(400, {
                    error: 'Requested uers not found!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'Requested uers not found!'
        });
    }
};

handler._user.post = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure taht the user doesnt already exist
        data.read('users', phone, (err, user) => {
            if(err) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                }

                // store the data to the database
                data.create('users', phone, userObject, (err) => {
                    if(!err) {
                        callback(201, {
                            message: "Users was created successfully."
                        })
                    } else {
                        callback(500, {
                            error: 'Could not create user!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'Internal server error!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!'
        });
    }
};

handler._user.put = (requestProperties, callback) => {
    const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;

    const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
        ? requestProperties.body.firstName
        : false;

    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if(phone) {
        if (firstName || lastName || password) {
            // lookup the data
            data.read('users', phone, (err, userData) => {
                if(!err && userData) {
                    const user = {...parseJSON(userData) };
                    if(firstName) {
                        user.firstName = firstName;
                    }
                    if(lastName) {
                        user.lastName = lastName;
                    }
                    if(password) {
                        user.password = hash(password);
                    }
                    data.update('users', phone, user, (err) => {
                        if(!err) {
                            callback(201, {
                                message: "Users was created updated."
                            })
                        } else {
                            callback(500, {
                                error: 'Could not update user!'
                            })
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Requested uers not found!'
                    });
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request!'
            });
        }
    } else {
        callback(400, {
            error: 'Requested uers not found!'
        });
    }
};

handler._user.delete = (requestProperties, callback) => {
    // check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    
    if(phone) {
        data.read('users', phone, (err, userData) => {
            if(!err && userData) {
                data.delete('users', phone, (err) => {
                    if(!err) {
                        callback(200, {
                            message: 'User deleted successfully.'
                        });
                    } else {
                        callback(400, {
                            error: 'Requested uers not found!'
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Requested uers not found!'
                });
            }
        });
    } else {
        callback(400, {
            error: 'Requested uers not found!'
        });
    }
};

module.exports = handler;