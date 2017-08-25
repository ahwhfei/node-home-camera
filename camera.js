(function () {
    'use strict';

    const cv = require('opencv');

    const videoSettings = require('./video-settings');
    const saveImage = require('./save-image');
    const streamVideo = require('./stream-video');
    const clients = require('./clients');

    const cameraId = 0;
    
    // initialize camera
    const camera = new cv.VideoCapture(cameraId);
    console.log(`Camera ${cameraId} opened`);

    const camWidth = videoSettings.width;
    const camHeight = videoSettings.height;
    camera.setWidth(camWidth);
    camera.setHeight(camHeight);

    const camFps = videoSettings.fps;
    const camInterval = 1000 / camFps;

    setInterval(function () {
        camera.read(function (err, im) {
            if (err) {
                throw err;
            }
            
            for (const index in clients) {
                clients[index].emit('frame', {buffer: im.toBuffer()});
            }
            
            saveImage(im.toBuffer());
        });

        if (new Date().getMinutes() === 0) {
            streamVideo();
        }
    }, camInterval);

    module.exports = camera;
})();
