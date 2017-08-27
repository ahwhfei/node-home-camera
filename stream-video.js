(function () {
    'use strict';
    const spawn = require('child_process').spawn;
    const fs = require('fs'); 
    const rimraf = require('rimraf');
    const glob = require('glob');

    const newFolder = require('./new-folder');

    let singleton = true;

    function spawnFfmpeg(settings) {
        if (!singleton) return;
        // if ((new Date().getMinutes())%3 !== 0) return;
        
        newFolder(settings.outputImageFolder);
        newFolder(settings.outputVideoFolder);

        const current = new Date();
        const oneHourAgo = new Date(current - 60*60*1000);
        let input = `${settings.outputImageFolder}/${oneHourAgo.toLocaleDateString().split('-').join('')}-${oneHourAgo.getHours()}-%d.jpg`;
        let output = `${settings.outputVideoFolder}/${oneHourAgo.toLocaleDateString().split('-').join('')}-${oneHourAgo.getHours()}-${current.toLocaleTimeString()}.mp4`;
        glob(input.replace('%d', '*'), (err, files) => {
            if (!files || !files.length) {
                input = `${settings.outputImageFolder}/${current.toLocaleDateString().split('-').join('')}-${current.getHours()}-%d.jpg`;
                output = `${settings.outputVideoFolder}/${current.toLocaleDateString().split('-').join('')}-${current.getHours()}-${current.toLocaleTimeString()}.mp4`;
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

    module.exports = spawnFfmpeg;
})();
