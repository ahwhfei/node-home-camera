(function () {
    'use strict';

    var socket = io.connect(window.location.origin);
    var request = new XMLHttpRequest();

    function addCameraCanvas () {
        var cameraList = JSON.parse(this.responseText);
        console.log(cameraList);

        var container = document.getElementById('container');

        cameraList.forEach(function (camera) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var img = new Image();

            canvas.width = camera.width;
            canvas.height = camera.height;

            context.fillStyle = '#333';
            context.fillText('Loading...', camera.width / 2 - 30, camera.height / 3);

            socket.on('frame'+camera.id, function (data) {
                var uint8Arr = new Uint8Array(data.buffer);
                var str = String.fromCharCode.apply(null, uint8Arr);
                var base64String = btoa(str);

                img.onload = function () {
                    context.drawImage(this, 0, 0, camera.width, camera.height);
                };
                img.src = 'data:image/png;base64,' + base64String;
            });

            container.appendChild(canvas);
        });
    }
    
    request.addEventListener('load', addCameraCanvas);
    request.open('GET', '/config');
    request.send();
    
})();
