//server
var Request = require("request");
var rp = require('request-promise');
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const yeast = require('yeast');
var t = yeast();
const io = require("socket.io-client");
//wss://bgdatafeedvpc.vps.com.vn/socket.io/?EIO=3&transport=websocket&sid=c-1FIKAz8ADLXk7kAA9N
//https://bgdatafeedvpc.vps.com.vn/socket.io/?EIO=3&transport=polling&t=NmlRcfY&sid=c-1FIKAz8ADLXk7kAA9N
//https://bgdatafeedvpc.vps.com.vn/socket.io/?EIO=3&transport=polling&t=NmlRcfY&sid=c-1FIKAz8ADLXk7kAA9N
app.get('/check', (req, res) => {
	//phase 1
  Request.get("https://liveboard.cafef.vn/socket.io/?EIO=3&transport=polling&t=" +t, (error, response, body) => {
    if(error) {
        //return console.dir(error);
		console.log(error);
    }
	//var data = JSON.stringify(response.body.replace("\x00\t\x07�0",''))
  //var data = response.body.replace("\x00\t\x07�0",'');
  var data = response.body.replace("96:0",'');
  var data1 = data.replace("2:40",'');
  var Jdata = JSON.parse(data1);
  console.log(Jdata);
	//console.dir(JSON.stringify(response.body.replace("\x00\t\x07�0",'')));
	if(response.statusCode==200){
		//console.dir(JSON.parse(body));
		//res.send(JSON.parse(body));
		//res.send(JSON.stringify(response.body.replace("\x00\t\x07�0",'')));
		console.log(Jdata.sid);
    //phase 2
    //Request.post("https://bgdatafeed.vps.com.vn/socket.io/?EIO=3&transport=polling&t=NmnYHnZ&sid="+Jdata.sid, (error, response1, body1) => {
      const socket = io.connect("wss://liveboard.cafef.vn/socket.io/?EIO=3&transport=websocket&t="+t +"&sid="+Jdata.sid); 
      console.log("Socket connect: " );
      console.dir(socket);
      socket.on("connect", () => {
        console.log(socket.connected); // true
      });
      
      socket.on("disconnect", () => {
        console.log(socket.connected); // false
      });
      Request.post({
        headers: { "content-type": "application/json" },
        url: 'https://liveboard.cafef.vn/socket.io/',
        body: JSON.stringify({
          "EIO": "3",
          "transport": "websocket",
          "t": t,
          "sid": Jdata.sid
        })
      }, (error, response1, body1) => {
          if(error) {
            //return console.dir(error);
        console.log(error);
        }
        if(response1.statusCode==200){
          console.log(response1);
          const socket = io.connect("wss://liveboard.cafef.vn/socket.io/?EIO=3&transport=websocket&sid="+Jdata.sid);
          console.log("Socket connect: " );
          console.dir(socket);
          socket.on("connect", () => {
            console.log(socket.connected); // true
          });
          
          socket.on("disconnect", () => {
            console.log(socket.connected); // false
          });
        } else {
        console.log("Lỗi Post phase 2: code", response1.statusCode);
        console.dir(response1);
        res.send(response1.body1);
        }
      });

     
		  //res.send(data);
    } else {
    console.log("Lỗi kết nối WS VieON: code", response.statusCode)
   // res.send(response.statusCode);
    }
	})
});
//server

var server = app.listen(8082, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Example app listening at http://%s:%s", host, port)
 })

 //2. https://bgdatafeed.vps.com.vn/socket.io/?EIO=3&transport=polling&t=Nmo1J8f&sid=7PH7ocULD4rXSgCPAMSu
//3. wss://bgdatafeed.vps.com.vn/socket.io/?EIO=3&transport=websocket&sid=7PH7ocULD4rXSgCPAMSu