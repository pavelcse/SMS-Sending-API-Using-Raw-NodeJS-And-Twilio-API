const handler = {};

handler.sampleHandler = (requestProparties, callback) => {
    console.log(requestProparties);
    
    callback(200, {
        message: 'this is a sample url.'
    });
};

module.exports = handler;