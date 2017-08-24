(function () {
    'use strict';
    const spawn = require('child_process').spawn;
    const fs = require('fs'); 
    const rimraf = require('rimraf');

    const settings = require('./video-settings');
    const newFolder = require('./new-folder');

    function spawnFfmpeg(exitCallback) {
        const current = new Date();
        const input = `${settings.outputImageFolder}/${current.toLocaleDateString().split('-').join('')}-${current.getHours() - 1}-%d.jpg`;
        const output = `${settings.outputVideoFolder}/${current.toLocaleDateString().split('-').join('')}-${current.getHours() - 1}.mp4`;
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
