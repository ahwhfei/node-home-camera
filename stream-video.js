(function () {
    'use strict';
    const spawn = require('child_process').spawn;
    const fs = require('fs'); 
    const rimraf = require('rimraf');
    const glob = require('glob');
    const ffmpeg = require('fluent-ffmpeg');

    const newFolder = require('./new-folder');
    
    let singleton = true;
    
    // const settings = require('./video-settings');
    // spawnFfmpeg(settings[0]);

    function recordVideoFromStream(stream) {
        console.log('recordVideoFromStream');
        ffmpeg().input(stream)
            .output('./output_video/whf.mp4');
    }

    function spawnFfmpeg(settings) {
        if (!singleton) return;
        if ((new Date().getMinutes())%2 !== 0) return;
        
        newFolder(settings.outputImageFolder);
        newFolder(settings.outputVideoFolder);

        const current = new Date();
        const oneHourAgo = new Date(current - 60*60*1000);
        let input = getInputFilePattern(settings, oneHourAgo);
        let output = getOutputFile(settings, oneHourAgo);
        glob(input.replace('%d', '*'), (err, files) => {
            if (!files || !files.length) {
                input = getInputFilePattern(settings, current);
                output = getOutputFile(settings, current);
            }

            const args = ['-y', '-framerate', settings.outputFps, '-i', input, output];
            const ffmpeg = spawn('ffmpeg', args);
            singleton = false;
      
            console.log('Spawning ffmpeg ' + args.join(' '));
    
            ffmpeg.on('exit', (code) => {
                singleton = true;
                console.log(`Child process exited with code ${code}`);
    
                if (!code) {
                    console.log(`Deleting these ${input.replace('%d', '*')} files`);
                    rimraf(input.replace('%d', '*'), (err) => err && console.log(err));
                }
            });
            ffmpeg.on('error', (err) => err && console.log(err));
    
            ffmpeg.stderr.on('data', function (data) {
                console.log('' + data);
            });
    
            return ffmpeg;
        });
    }

    function getInputFilePattern(settings, date) {
        return `${settings.outputImageFolder}/${date.toLocaleDateString().split('-').join('')}-${date.getHours()}-%d.jpg`;
    }

    function getOutputFile(settings, date) {
        return `${settings.outputVideoFolder}/${date.toLocaleDateString().split('-').join('')}-${date.getHours()}-${new Date().toLocaleTimeString().split(':').join('')}.mp4`;
    }

    module.exports = {
        spawnFfmpeg: spawnFfmpeg,
        recordVideoFromStream: recordVideoFromStream
    };
})();
