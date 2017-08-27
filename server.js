(function () {
    'use strict';
    
    const http = require('http');
    
    const app = require('./app');
    let clients = require('./clients');
    const setupCamera = require('./camera');
    const config = require('./video-settings');
    
    let port = normalizePort(process.env.PORT || '8080');
    app.set('port', port);
    
    // HTTP Server 
    const server = http.createServer(app);
    server.listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });
    
    // WebSocket Server
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        const index = '' + new Date().getTime();
        clients[index] = socket;
    });
    io.on('disconnect', () => console.log('exit'));

    for (const c of config) {
        setupCamera(c);
    }

    function normalizePort(val) {
        let port = +val;

        if (isNaN(port)) {
            return val;
        }

        if (port >= 0) {
            return port;
        }

        return false;
    }
})();
