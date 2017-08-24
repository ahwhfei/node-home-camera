(function () {
    'use strict';

    const fs = require('fs');

    let count = 0;
    let preTime = new Date();

    module.exports = function (buffer) {
        const current = new Date();
        if (current.getHours() !== preTime.getHours()) {
            preTime = current;
            count = 0;
        }

        fs.writeFile(
            `output/${current.toLocaleDateString().split('-').join('')}-${current.getHours()}-${++count}.jpg`,
            buffer, () => {});
    }
})();
