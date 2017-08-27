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

    function readCamera(config, camera, callback) {
        if (config.static) {
            request(config.camera, (error, response, body) => {
                if (error || !response || response.statusCode !== 200) {
                    return;
                }
    
                const contentType = response.headers['content-type'];
                if (contentType === 'image/jpeg') {
                    callback(config, body);
                }
            })
        } else if (Number.isInteger(config.camera)) {
            camera.read(function (error, im) {
                if (error) {
                    error && console.log(`Camera ${config.camera} opened failed`, error);
                }
                
                callback(config, im.toBuffer());
            });
        }
    }

    function setupCamera(config) {
        let camera;
        if (Number.isInteger(config.camera)) {
            // initialize camera
            camera = new cv.VideoCapture(config.camera);
            console.log(`SOURCE: Camera ${config.camera} opened`);

            const camWidth = config.width;
            const camHeight = config.height;
            camera.setWidth(camWidth);
            camera.setHeight(camHeight);
        } else if (config.static) {
            console.log(`SOURCE: Static image source ${config.camera}`);
        }

        const camFps = config.fps;
        const camInterval = 1000 / camFps;

        setInterval(() => {
            readCamera(config, camera, processImage);
              
            streamVideo(config);
        }, camInterval);

        return camera;
    }

    function processImage(config, image) {
        if (!image) return;

        // Send image to clients
        sendtoClients(config, image);

        // Save image to disk
        saveImage(image, config);
    }

    function sendtoClients(config, image) {
        if (!image) return;

        for (const index in clients) {
            clients[index].emit('frame' + config.id, {buffer: image});
        }
    }

    module.exports = setupCamera;
})();
