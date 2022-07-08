const ffmpeg = require('fluent-ffmpeg');
// var command = ffmpeg();

const http = require('http');
var fs = require('fs');

const PORT = 4000;

ffmpeg('rtsp://admin:Mtisat1970@85.114.48.102:554/Streaming/Channels/101').outputOptions([
    '-fflags', 'flush_packets', '-max_delay 5', '-flags', '-global_header', '-hls_time 5', '-hls_list_size 3', '-vcodec', 'copy -y'
    ]).output('./videos/ipcam/index.m3u8').on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('error', function (err, stdout, stderr) {
        console.log('An error occurred: ' + err.message, err, stderr);
    })
    .on('progress', function (progress) {
        // console.log(JSON.stringify(progress, null, 2))
        console.log('Processing: ' + JSON.stringify(progress))
    })
    .on('end', function (err, stdout, stderr) {
        console.log('Finished processing!' /*, err, stdout, stderr*/)
    })
    .run()



http.createServer(function (request, response) {
    console.log('request starting...', new Date());

    

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    if (request.method === 'OPTIONS') {
        response.writeHead(204, headers);
        response.end();
        return;
    }

    var filePath = './videos/ipcam' + request.url;
    console.log(filePath);;
    fs.readFile(filePath, function (error, content) {
        response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.end(content, 'utf-8');
        }
    });
}).listen(PORT);






