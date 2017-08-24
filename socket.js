(function () {
    'use strict';

    const videoSettings = require('./video-settings');
    const camera = require('./camera');

    const camFps = videoSettings.fps;
    const camInterval = 1000 / camFps;

    module.exports = function (socket) {
        console.log(`Client connected at ${new Date()}`);
        setInterval(function () {
            camera.read(function (err, im) {
                if (err) {
                    throw err;
                }

                socket.emit('frame', {buffer: im.toBuffer()});
            });
        }, camInterval);
    };
})();
