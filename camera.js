(function () {
    'use strict';

    const cv = require('opencv');
    const request = require('request').defaults({encoding: null});
    const Stream = require('stream');
    const ffmpeg = require('fluent-ffmpeg');

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

    function readCamera(config, stream, camera, callback) {
        
        if (config.static) {
            request(config.camera, (error, response, body) => {
                if (error || !response || response.statusCode !== 200) {
                    return;
                }
    
                const contentType = response.headers['content-type'];
                if (contentType === 'image/jpeg') {
                    callback(config, stream, body);
                }
            })
        } else if (Number.isInteger(config.camera)) {
            camera.read(function (error, im) {
                if (error) {
                    error && console.log(`Camera ${config.camera} opened failed`, error);
                }
                
                callback(config, stream, im.toBuffer());
            });
        }
    }

    function setupCamera(config) {
        let camera;

        let stream = new Stream.PassThrough();
        // stream.pipe(process.stdout);
        // streamVideo.recordVideoFromStream(stream);
        ffmpeg().input(stream)
            .save('./output_video/whff.mp4')
            .on('error', (err) => {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', () => {
                console.log('Processing finished !');
            });

        // ffmpeg('./file.mp4').size('320x240').save('./file_320x240.mp4');;

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
            readCamera(config, stream, camera, processImage);
              
            // streamVideo(config);
        }, camInterval);

        return camera;
    }

    function createReadStream(stream, image) {
        stream.push(image);
        if (new Date().getMinutes()%3 === 0) {
            stream.push(null);
        }
    }

    function processImage(config, stream, image) {
        if (!image) return;

        createReadStream(stream, image);

        // Send image to clients
        sendtoClients(config, image);

        // Save image to disk
        // saveImage(image, config);
    }

    function sendtoClients(config, image) {
        if (!image) return;

        for (const index in clients) {
            clients[index].emit('frame' + config.id, {buffer: image});
        }
    }

    module.exports = setupCamera;
})();
