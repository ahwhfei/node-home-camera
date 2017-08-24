(function () {
    'use strict';
    const spawn = require('child_process').spawn;
    const fs = require('fs'); 
    const rimraf = require('rimraf');

    const videoSettings = require('./video-settings');

    const current = new Date();
    const output = `output_video/${current.toLocaleDateString().split('-').join('')}-${current.getHours() - 1}.mp4`;

    if (fs.existsSync(output)) { 
        rimraf(output, () => {});
    } 

    function spawnFfmpeg(exitCallback) {
        const current = new Date();
        const input = `output/${current.toLocaleDateString().split('-').join('')}-${current.getHours() - 1}-%d.jpg`;
        const output = `output_video/${current.toLocaleDateString().split('-').join('')}-${current.getHours() - 1}.mp4`;
        const args = ['-framerate', videoSettings.outputFps, '-i', input, output];

        if (fs.existsSync(output)) { 
            rimraf(output, () => {});
        } 

        const ffmpeg = spawn('ffmpeg', args);

        console.log('Spawning ffmpeg ' + args.join(' '));

        ffmpeg.on('exit', exitCallback);

        ffmpeg.stderr.on('data', function (data) {
            console.log('' + data);
        });

        return ffmpeg;
    }

    const ffmpeg = spawnFfmpeg((code) => {
        console.log('child process exited with code ' + code);
    });

    module.exports = spawnFfmpeg;
})();
