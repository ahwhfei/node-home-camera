(function () {
    'use strict';

    const cv = require('opencv');

    // camera properties
    const camWidth = 640;
    const camHeight = 480;
    const camFps = 10;
    const camInterval = 1000 / camFps;

    // face detection properties
    const rectColor = [0, 255, 0];
    const rectThickness = 2;

    // initialize camera
    const camera = new cv.VideoCapture(0);
    camera.setWidth(camWidth);
    camera.setHeight(camHeight);

    module.exports = function (socket) {
        setInterval(function () {
            camera.read(function (err, im) {
                if (err) {
                    throw err;
                }

                socket.emit('frame', { buffer: im.toBuffer() });
            });
        }, camInterval);
    };

})();
