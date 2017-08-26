(function () {
    const settings = [
        {
            camera: 0,
            fps: 10,
            width: 640,
            height: 480,
            outputFps: 40,

            outputImageFolder: './output',
            outputVideoFolder: './output_video',
        },
        {
            camera: 'http://192.168.31.59/image/jpeg.cgi',
            static: true,
            fps: 10,
            width: 640,
            height: 480,
            outputFps: 40,

            outputImageFolder: './output2',
            outputVideoFolder: './output_video2',
        },
    ];

    module.exports = settings;
})();
