(function () {
    'use strict';
    const spawn = require('child_process').spawn;
    const fs = require('fs'); 
    const rimraf = require('rimraf');

    const settings = require('./video-settings');
    const newFolder = require('./new-folder');

    function spawnFfmpeg(exitCallback) {
        const current = new Date();
        const oneHourBefore = new Date(current - 60*60*1000);
        const input = `${settings.outputImageFolder}/${oneHourBefore.toLocaleDateString().split('-').join('')}-${oneHourBefore.getHours()}-%d.jpg`;
        const output = `${settings.outputVideoFolder}/${oneHourBefore.toLocaleDateString().split('-').join('')}-${oneHourBefore.getHours()}.mp4`;
        const args = ['-y', '-framerate', settings.outputFps, '-i', input, output];

        newFolder(settings.outputImageFolder);
        newFolder(settings.outputVideoFolder);

        const ffmpeg = spawn('ffmpeg', args);

        console.log('Spawning ffmpeg ' + args.join(' '));

        ffmpeg.on('exit', exitCallback);
        ffmpeg.on('error', (err) => console.log(err));

        ffmpeg.stderr.on('data', function (data) {
            console.log('' + data);
        });

        return ffmpeg;
    }

    module.exports = spawnFfmpeg;
})();
