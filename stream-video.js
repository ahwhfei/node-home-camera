(function () {
    'use strict';
    const spawn = require('child_process').spawn;
    const fs = require('fs'); 
    const rimraf = require('rimraf');

    const settings = require('./video-settings');
    const newFolder = require('./new-folder');

    let singleton = true;

    function spawnFfmpeg() {
        if (!singleton) return;

        const current = new Date();
        const oneHourAgo = new Date(current - 60*60*1000);
        const input = `${settings.outputImageFolder}/${oneHourAgo.toLocaleDateString().split('-').join('')}-${oneHourAgo.getHours()}-%d.jpg`;
        const output = `${settings.outputVideoFolder}/${oneHourAgo.toLocaleDateString().split('-').join('')}-${oneHourAgo.getHours()}.mp4`;
        const args = ['-y', '-framerate', settings.outputFps, '-i', input, output];

        newFolder(settings.outputImageFolder);
        newFolder(settings.outputVideoFolder);

        const ffmpeg = spawn('ffmpeg', args);
        singleton = false;

        console.log('Spawning ffmpeg ' + args.join(' '));

        ffmpeg.on('exit', (code) => {
            singleton = true;
            console.log(`Child process exited with code ${code}`);
            if (code) {
                rimraf(input.replace('%d', '*'), (err) => err && console.log(err));
            }
        });
        ffmpeg.on('error', (err) => err && console.log(err));

        ffmpeg.stderr.on('data', function (data) {
            console.log('' + data);
        });

        return ffmpeg;
    }

    module.exports = spawnFfmpeg;
})();
