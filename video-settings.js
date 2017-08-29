(function () {
    const settings = [
        {
            id: 1,
            camera: 0,
            fps: 10,
            width: 640,
            height: 480,
            
            outputFps: 60,
            outputImageFolder: './output',
            outputVideoFolder: './output_video',
            outputVideoDuration: 1800,
        },
        {
            id: 2,
            camera: 'http://192.168.31.59/image/jpeg.cgi',
            static: true,
            fps: 10,
            width: 640,
            height: 480,
            
            outputFps: 60,
            outputImageFolder: './output2',
            outputVideoFolder: './output_video2',
            outputVideoDuration: 1800,
        },
    ];

    module.exports = settings;
})();
