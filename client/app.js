(function () {
    'use strict';

    var socket = io.connect(window.location.origin);
    var canvas = document.getElementById('canvas-video');
    var canvas2 = document.getElementById('canvas-video2');
    var context = canvas.getContext('2d');
    var context2 = canvas2.getContext('2d');
    var img = new Image();
    var img2 = new Image();
    

    context.fillStyle = '#333';
    context.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

    context2.fillStyle = '#333';
    context2.fillText('Loading...', canvas2.width / 2 - 30, canvas2.height / 3);

    socket.on('frame', function (data) {
        var uint8Arr = new Uint8Array(data.buffer);
        var str = String.fromCharCode.apply(null, uint8Arr);
        var base64String = btoa(str);

        img.onload = function () {
            context.drawImage(this, 0, 0, canvas.width, canvas.height);
        };
        img.src = 'data:image/png;base64,' + base64String;
    });

    socket.on('frame2', function (data) {
        var uint8Arr = new Uint8Array(data.buffer);
        var str = String.fromCharCode.apply(null, uint8Arr);
        var base64String = btoa(str);

        img2.onload = function () {
            context2.drawImage(this, 0, 0, canvas2.width, canvas2.height);
        };
        img2.src = 'data:image/jpeg;base64,' + base64String;
    });
})();
