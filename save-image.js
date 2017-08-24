(function () {
    'use strict';

    const fs = require('fs');
    const mkdirp = require('mkdirp');

    const settings = require('./video-settings');
    const newFolder = require('./new-folder');

    let count = 0;
    let preTime = new Date();

    newFolder(settings.outputImageFolder);

    module.exports = function (buffer) {
        const current = new Date();
        if (current.getHours() !== preTime.getHours()) {
            preTime = current;
            count = 0;
        }

        fs.writeFile(
            `${settings.outputImageFolder}/${current.toLocaleDateString().split('-').join('')}-${current.getHours()}-${++count}.jpg`,
            buffer,
            (err) => err && console.log(err));
    }
})();
