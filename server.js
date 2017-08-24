(function () {
    'use strict';
    
    const app = require('./app');
    let port = normalizePort(process.env.PORT || '8080');
    app.set('port', port);
    
    // HTTP Server 
    const http = require('http');
    const server = http.createServer(app);
    server.listen(app.get('port'), () => {
        console.log('Express server listening on port ' + app.get('port'));
    });

    // WebSocket Server
    const io = require('socket.io')(server);
    io.on('connection', require('./socket'));
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
