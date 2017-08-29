(function () {
    'use strict';

    const express = require('express');

    const config = require('../video-settings');
    
    const router = express.Router();

    router.get('/', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(config));
    });

    module.exports = router;
})();
