(function () {
    'use strict';

    const cv = require('opencv');
    const request = require('request').defaults({encoding: null});

    const saveImage = require('./save-image');
    const streamVideo = require('./stream-video');
    const clients = require('./clients');

    function setupStaticCamera(config) {
        const camFps = config.fps;
        const camInterval = 1000 / camFps;

        setInterval(() => {
            request(config.camera, (error, response, body) => {
                if (error || !response || response.statusCode !== 200) {
                    error && console.log(`Camera ${config.camera} opened failed`, error);
                    return;
                }
    
                const contentType = response.headers['content-type'];
                if (contentType === 'image/jpeg') {
                    for (const index in clients) {
                        clients[index].emit('frame2', {buffer: body});
                    }
                }
            });

        }, camInterval);
    }

    function setupCamera(config) {

        if (config.static) {
            setupStaticCamera(config);
            return;
        }

        // initialize camera
        const camera = new cv.VideoCapture(config.camera);
        console.log(`Camera ${config.camera} opened`);

        const camWidth = config.width;
        const camHeight = config.height;
        camera.setWidth(camWidth);
        camera.setHeight(camHeight);

        const camFps = config.fps;
        const camInterval = 1000 / camFps;

        setInterval(function () {
            camera.read(function (err, im) {
                if (err) {
                    throw err;
                }
                
                for (const index in clients) {
                    clients[index].emit('frame', {buffer: im.toBuffer()});
                }
                
                saveImage(im.toBuffer(), config);
            });

            if (new Date().getMinutes() === 0) {
                streamVideo(config);
            }
        }, camInterval);

        return camera;
    }

    module.exports = setupCamera;
})();
