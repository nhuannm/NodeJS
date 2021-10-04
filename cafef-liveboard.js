var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    connectCounter = 0;

//var allowedDomain = 'https://liveboard.cafef.vn:*';
var allowedDomain = 'https://liveboard.cafef.vn/socket.io/'


var socket_server = http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    var parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname != '/') {
        switch (parsedUrl.pathname) {
            case '/intraday-change':
                io.sockets.emit('ticker_change', parsedUrl.query.data);
                console.log('Data size: ' + Buffer.byteLength(parsedUrl.query.data.toString(), 'utf8') + ' bytes');
                res.end('success');
                break;
            case '/index-change':
                io.sockets.emit('index_change', parsedUrl.query.data);
                console.log('Data size: ' + Buffer.byteLength(parsedUrl.query.data.toString(), 'utf8') + ' bytes');
                res.end('success');
                break;
            case '/pt-change':
                io.sockets.emit('pt_change', parsedUrl.query.data);
                console.log('Data size: ' + Buffer.byteLength(parsedUrl.query.data.toString(), 'utf8') + ' bytes');
                res.end('success');
                break;

            case '/user.chn':
                res.writeHead(301, {
                    'Location': '/?userlist=true'
                });
                res.end();
                break;
            case '/upcom.chn':
                res.writeHead(301, {
                    'Location': '/?center=9'
                });
                res.end();
                break;
            case '/hsx.chn':
                res.writeHead(301, {
                    'Location': '/?center=1'
                });
                res.end();
                break;
            case '/hnx.chn':
                res.writeHead(301, {
                    'Location': '/?center=2'
                });
                res.end();
                break;
            case '/hnx/thoa-thuan.chn':
                res.writeHead(301, {
                    'Location': '/?center=5'
                });
                res.end();
                break;
            case '/hsx/thoa-thuan.chn':
                res.writeHead(301, {
                    'Location': '/?center=3'
                });
                res.end();
                break;

            default:
                res.writeHead(301, {
                    'Location': '/'
                });
                res.end();
        }

    } else {
        fs.readFile('./Default.htm', function (error, content) {
            if (error) {
                res.writeHead(500);
                res.end();
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content, 'utf-8');
            }
        });
    }


}).listen(8088);

var io = require('socket.io')(socket_server,{
    transports: ["websock","polling"],
    origin: allowedDomain
});
//io.set('log level', 1);
//io.enable('browser client minification'); // send minified client
//io.enable('browser client etag'); // apply etag caching logic based on version number
//io.enable('browser client gzip'); // gzip the file

//io.set('origins', allowedDomain);
//io.set('transports', ['jsonp-polling']);
console.dir(io);
io.sockets.on('connection', function (socket) {
    connectCounter++;
    console.log('+ Concurrent connection: ' + connectCounter);

    socket.on('disconnect', function () {
        connectCounter--;
        console.log('- Concurrent connection: ' + connectCounter);
    });

});