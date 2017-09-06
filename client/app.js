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

            if (camera.width > window.innerWidth/2) {
                canvas.width = camera.width/2;
                canvas.height = camera.height/2;
            } else {
                canvas.width = camera.width;
                canvas.height = camera.height;
            }
            
            context.fillStyle = '#333';
            context.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3);

            socket.on('frame'+camera.id, function (data) {
                var uint8Arr = new Uint8Array(data.buffer);
                var str = '';

                var len = uint8Arr.byteLength;
                for (var i = 0; i < len; i++) {
                    str += String.fromCharCode(uint8Arr[i]);
                }

                var base64String = btoa(str);

                img.onload = function () {
                    if (camera.width > window.innerWidth/2) {
                        context.drawImage(this, 0, 0, camera.width/2, camera.height/2);                        
                    } else {
                        context.drawImage(this, 0, 0, camera.width, camera.height);
                    }
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
