// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

//base directory of data folder
lib.basedir = path.join(__dirname, '../.data/');

// write data to file
lib.create = function(dir, file, data, callback) {
    //open file for write
    fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and close it
            fs.writeFile(fileDescriptor, stringData, function(err) {
                if(!err) {
                    fs.close(fileDescriptor, function(err) {
                        if(!err){
                            callback(false);
                        } else {
                            callback('Error closing the file')
                        }
                    });
                } else {
                    callback('Error writing new file');
                }
            });
        } else {
            callback('could not create new file, it may already exists!');
        }
    });
};

// read data from file
lib.read = function(dir, file, callback) {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
lib.update = function(dir, file, data, callback) {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', function(err, fileDescriptor) {
        if(!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);
            // truncate the file
            fs.ftruncate(fileDescriptor, (err) => {
                if(!err) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(!err) {
                            fs.close(fileDescriptor, (err) => {
                                if(!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing the file');
                                }
                            })
                        } else {
                            callback('Error writing the file');
                        }
                    })
                } else {
                    callback('Error truncating the file');
                }
            })
        } else {
            callback('Error! File may not exist!');
        }
    })
}

// delete file
lib.delete = function(dir, file, callback) {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if(!err) {
            callback(false)
        } else {
            callback('Error while deleting');
        }
        
    });
};

module.exports = lib;