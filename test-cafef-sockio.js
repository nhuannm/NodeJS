//server
var Request = require("request");
var rp = require('request-promise');
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const io = require("socket.io-client");
const socket = io.connect("https://liveboard.cafef.vn/socket.io/?EIO=3&transport=polling&t=NmnYHnZ");
console.dir(socket);
          socket.on("connect", () => {
            console.log(socket.connected); // true
          });
          
          socket.on("disconnect", () => {
            console.log(socket.connected); // false
          });