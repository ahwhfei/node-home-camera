(function () {
    'use strict';

    const fs = require('fs');
    const mkdirp = require('mkdirp');

    const newFolder = require('./new-folder');

    let count = 0;
    let preTime = new Date();

    
    module.exports = function (buffer, config) {
        newFolder(config.outputImageFolder);

        const current = new Date();
        if (current.getHours() !== preTime.getHours()) {
            preTime = current;
            count = 0;
        }

        fs.writeFile(
            `${config.outputImageFolder}/${current.toLocaleDateString().split('-').join('')}-${current.getHours()}-${++count}.jpg`,
            buffer,
            (err) => err && console.log(err));
    }
})();
