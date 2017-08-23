(function () {
    'use strict';

    const express = require('express');
    const path = require('path');

    const app = express();

    const staticFolder = path.join(__dirname, './client')
    app.use(express.static(staticFolder));

    app.get('*', function (req, res) {
        res.sendFile('index.html', { root: staticFolder });
    });

    module.exports = app;
})();
