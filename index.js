const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();

server.connection( {
    port: 8081
});

server.route({

    method: 'GET',
    path: '/hello',
    handler: ( request, reply ) => {
        reply( 'Hello World!' );
    }

});

const options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'rotating-file-stream',
            args: [
                'server_log',
                {
                    size: '1M',
                    path: './logs'
                }
            ]
        }]
    }
};

server.register({
    register: Good,
    options: options
}, function (err) {

    if (err) {
        throw err; 
    }

    server.start(function () {

        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

module.exports = server;