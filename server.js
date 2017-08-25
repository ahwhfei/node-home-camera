(function () {
    'use strict';
    
    const http = require('http');
    
    const app = require('./app');
    let clients = require('./clients');
    const camera = require('./camera');
    
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
