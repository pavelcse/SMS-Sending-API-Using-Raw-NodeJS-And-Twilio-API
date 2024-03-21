const handler = {};

handler.notFoundHandler = (requestProparties, callback) => {
    callback(404, {
        message: 'Page not found.'
    });
};

module.exports = handler;