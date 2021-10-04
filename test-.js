var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(process.env.PORT || 8080);
var io = require("socket.io")(server);
var request = require('request');

app.use(express.static(__dirname + '/views'));
app.get('/getliststockdata/:symbols', function(req,res){
    var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() +1 ;
	var yesterday = today.getDate() -1;
	var stringToday = year + '-' + month + '-' + yesterday;
	var stringTodayLastYear = (year-1) + '-' + month + '-' + yesterday;
	request.get('https://bgapidatafeedvpc.vps.com.vn/getliststockdata/'+req.params.symbols.toUpperCase(), (error, response, body) => {
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


app.get("/checksymbol/:symbols", function(req,res){
    request('https://www.quandl.com/api/v3/datasets/WIKI/'+req.params.symbols.toUpperCase()+'.json?api_key=tPFVCm-gpx2HuDusM82E&start_date=2016-08-24&end_date=2016-08-24', function(error, response, body){
        if(response.statusCode == 404){
		    res.end("not found");
		} else {
		    res.send({
		        name: JSON.parse(body).dataset.name,
		        symbol: JSON.parse(body).dataset.dataset_code
		    });
		}
    });
});


io.on("connection", function(socket) {

    socket.on("chat", function(message) {
    	socket.broadcast.emit("message", message);
    });

});
