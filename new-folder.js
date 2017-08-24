(function () {
    'use strict';

    const fs = require('fs');
    const mkdirp = require('mkdirp');

    module.exports = (folder) => {
        if (!fs.existsSync(folder)) {
            mkdirp(folder, (err) => err && console.log(err));
        }
    }
})();
