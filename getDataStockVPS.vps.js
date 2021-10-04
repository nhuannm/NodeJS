//server
var Request = require("request");
var rp = require('request-promise');
var express = require('express');
var app = express();
var allowedOrigins = "http://localhost:* http://127.0.0.1:*";
var http = require("http");
var server = http.createServer(app).listen(process.env.PORT || 8080);
var io = require("socket.io")(server, { 
    cors: {    
      origin: "*",    
      methods: ["GET", "POST"]  
    }
});

const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getprice/:id', (req, res) => {
	Request.get("https://spapidatafeed.vps.com.vn/getliststockdata/" + req.params.id, (error, response, body) => {
    if(error) {
        //return console.dir(error);
		console.log(error);
    }
	if(response.statusCode==200){
		console.dir(JSON.parse(body));
        io.emit('update',JSON.parse(body));
		res.send(JSON.parse(body));
	} else {
	console.log("Lỗi kếtnoois VPS: code", response.statusCode)
	res.send(response.statusCode);
	}
	})
});
app.get('/getinfo/:id', (req, res) => {
	Request.get("https://spapidatafeed.vps.com.vn/getliststockbaseinfo/" + req.params.id, (error, response, body) => {
    if(error) {
        //return console.dir(error);
		console.log(error);
    }
	if(response.statusCode==200){
		console.dir(JSON.parse(body));
		res.send(JSON.parse(body));
	} else {
	console.log("Lỗi kếtnoois VPS: code", response.statusCode)
	res.send(response.statusCode);
	}
	})
});
app.get('/getlistpt', (req, res) => {
	Request.get("https://spapidatafeed.vps.com.vn/getlistpt", (error, response, body) => {
    if(error) {
        //return console.dir(error);
		console.log(error);
    }
	if(response.statusCode==200){
		console.dir(JSON.parse(body));
		res.send(JSON.parse(body));
	} else {
	console.log("Lỗi kếtnoois VPS: code", response.statusCode)
	res.send(response.statusCode);
	}
	})
});
//server


var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
 }) 
 io.on("connection", function(socket) {

    socket.on("chat", function(message) {
    	socket.broadcast.emit("message", message);
    });

});
