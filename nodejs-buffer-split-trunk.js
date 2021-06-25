//VieON Gateway
const fs = require('fs');
//var fs=require ("fs")
var Request = require("request");
var rp = require('request-promise');
const crypto = require("crypto")
//server
var express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
const SPTpublicKey = fs.readFileSync("./pem_files_dev/2021-06-22_spt_public_dev.pem", { encoding: "utf8" });
const SPTprivateKey = fs.readFileSync("./pem_files_dev/2021-06-22_spt_private_dev.pem", { encoding: "utf8" });
//console.log (SPTpublicKey);
//console.log (SPTprivateKey);
const VieONpublicKey = fs.readFileSync("./pem_files_dev/vieon_public_dev.pem", { encoding: "utf8" });
const VieONprivateKey = fs.readFileSync("./pem_files_dev/vieon_private_dev.pem", { encoding: "utf8" });
//console.log (VieONpublicKey);
//console.log (VieONprivateKey);
//Tao function
function MaHoa (plaintext, publicKey) { 
    //const publicKey = fs.readFileSync(publicKeyFile, "utf8"); 
    //key size: 2048 bits = 256 bytes;
    //padding 41 bytes;/
    //input data < 256-41 =215 bytes
    // publicEncrypt() method with its parameters 
    const encrypted = crypto.publicEncrypt(
	{
		key: publicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING
		//oaepHash: "sha256",
	},
	// We convert the data string to a buffer using `Buffer.from`
	Buffer.from(plaintext) // data in buffer
	)
    return encrypted.toString("base64"); 
} 
//mã hóa input buffer
function MaHoaBuff (buffData, publicKey) { 
    //const publicKey = fs.readFileSync(publicKeyFile, "utf8"); 
    //key size: 2048 bits = 256 bytes;
    //padding 41 bytes;/
    //input data < 256-41 =215 bytes
    // publicEncrypt() method with its parameters 
    const encrypted = crypto.publicEncrypt(
	{
		key: publicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING
		//oaepHash: "sha256",
	},
	// We convert the data string to a buffer using `Buffer.from`
	buffData // data in buffer
	)
    return encrypted; 
} 
///Giai mã buff
//mã hóa input buffer
function GiaiMaBuff(buffData, privateKey) { 
    //const publicKey = fs.readFileSync(publicKeyFile, "utf8"); 
    //key size: 2048 bits = 256 bytes;
    //padding 41 bytes;/
    //input data < 256-41 =215 bytes
    // publicEncrypt() method with its parameters 
    try {
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_PADDING
                //oaepHash: "sha256",
            },
        // We convert the data string to a buffer using `Buffer.from`
        buffData // data in buffer
        //Buffer.from(buffData,"base64")
        )
        return decryptedData; 
    } catch (error) {
        console.dir(error);
    }
    
} 

function ChunkBuff(msg, size){
    var maxLength = size;
    var dataLength = Buffer.byteLength(msg);
    var int = Math.floor(dataLength / maxLength);
    var msgbuff = Buffer.from(msg);
   console.log("Chunk msg buffer dataLength: ", dataLength);
   console.log("Chunk msg buffer elements: ", int);
    var result = [];
    var mahoa = [];
    var start, count;
    var encrypted;
    for (i=0; i<=int; i++){
        console.log("i=",i);
        start = maxLength * i;
        count = maxLength;
        if (i == int){
            count = dataLength - start;
            console.log("i=int",start);
        }
        result.push(msgbuff.slice(start, start+count));
       
    }
   return result;
}
function ChunkBuffGiaiMa(msg, size){
    var maxLength = size;
    var dataLength = Buffer.byteLength(msg);
    var int = Math.floor(dataLength / maxLength) -1;
    var msgbuff = Buffer.from(msg);
   console.log("Chunk msg buffer dataLength: ", dataLength);
   console.log("Chunk msg buffer elements: ", int);
    var result = [];
    var mahoa = [];
    var start, count;
    var encrypted;
    for (i=0; i<=int; i++){
        console.log("i=",i);
        start = maxLength * i;
        count = maxLength;
        if (i == int){
            count = dataLength - start;
            console.log("i=int",start);
        }
        result.push(msgbuff.slice(start, start+count));
       
    }
   return result;
}
// to array buff
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
function arrayBufferToBufferCycle(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}
//ma hóa promiseasync function
async function MaHoaPromis(buff,PublicKey){
    const encrypted = crypto.publicEncrypt(
        {
            key: PublicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
            //oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        //Buffer.from(msg).slice(start,count+start) // data in 
        buff
        )
    try {
        Promise.all;
        console.log("Mahoa promiss: ",Promise.resolve(encrypted));
		return Promise.resolve(encrypted);
        
	  }
	  catch (error) {
		return Promise.reject(error);
	  }
    //return encrypted;
}
//Giai ma
function GiaiMa (plaintext, privateKey) {
	const decryptedData = crypto.privateDecrypt(
	{
		key: privateKey,
		// In order to decrypt the data, we need to specify the
		// same hashing function and padding scheme that we used to
		// encrypt the data in the previous step
		padding: crypto.constants.RSA_PKCS1_PADDING
		//oaepHash: "sha256",
	},
	Buffer.from(plaintext,"base64")
	
	)
	//return decryptedData.toString("utf8");
	try {
		return decryptedData.toString("utf8");
	  }
	  catch (error) {
		return (error);
	  }
}
console.log("VieON Publ size:",256-41);
const msg ='{"partner_code":"spt_dev","token":"vpe4Xfdege7rUpr9CmkyUVzQuW3xQekV","transaction":"1234567","package_id":36,"phone":"0913366095","user_id":"b176b975-5f81-9ffe-8f34-b15d622afbc1","service_time":"2021-06-22T00:00:00.00Z","status":1,"status_message":"thành công"},';
//const msg = "Nguyễn Mạnh Nhuận"
/* console.log("msg size:",Buffer.byteLength(msg));
//const dlMaHoa =  MaHoa(msg,VieONpublicKey);
//const dlGiaiMa = GiaiMa(dlMaHoa,VieONprivateKey);
//console.log("Mã hóa: ",dlMaHoa);
//console.log("Giải mã: ",dlGiaiMa);
// 256-41
var list = ChunkBuff(msg, 245);
var listSize = list.length;
console.log(list);
console.log("Buffer Array size ==> ",listSize);
const iterator = list.values();
var arrMaHoa = [];
for (const value of iterator) {
    
    var maHoa = MaHoaBuff(value,VieONpublicKey);
    console.dir("values mã hóa: " ,maHoa);
     arrMaHoa.push(maHoa);
  }
console.dir("Array Mahoa ==>",arrMaHoa);
var newbuff = Buffer.concat(arrMaHoa);
console.log("New buff mã hóa ==>", newbuff);
var strMaHoa = newbuff.toString("base64");
console.log("strMaHoa base 64:", strMaHoa);
//Giải Mã
//console.dir("test GM", GiaiMaBuff(strMaHoa,VieONprivateKey));
var strdebase64 = new Buffer.from(strMaHoa,"base64");
console.log("New buff giải mã ==>", strdebase64);
var listGiaiMa = ChunkBuffGiaiMa(strdebase64, 256);
var listGiaiMaSize = listGiaiMa.length;
console.log("Buffer Array size GiaiMa ==> ",listGiaiMaSize);
const iteratorGiaMa = listGiaiMa.values();
var arrGiaiMa = [];

for (const value of iteratorGiaMa) {
    console.dir("values giải mã array" ,value);
    var GiaiMa = GiaiMaBuff(value,VieONprivateKey);
    
     arrGiaiMa.push(GiaiMa);
  }
console.dir("Buff GiaiMa",arrGiaiMa);
var newbuffGiaiMa = Buffer.concat(arrGiaiMa);
console.log("New buff newbuffGiaiMa ==> ", newbuffGiaiMa);
var strGiaiMa = newbuffGiaiMa;
console.log("strMaHoa base 64:", strGiaiMa);
var FinalGiaiMa = strGiaiMa.toString("utf8");
console.log("GiaiMa ==> ", FinalGiaiMa);
*/
// code function
function MaHoaLongMess(msg,publicKey) {
    var list = ChunkBuff(msg, 245);
    var listSize = list.length;
    console.log(list);
    console.log("Buffer Array size ==> ",listSize);
    const iterator = list.values();
    var arrMaHoa = [];
    for (const value of iterator) {
        
        var maHoa = MaHoaBuff(value,publicKey);
        console.dir("values mã hóa: " ,maHoa);
        arrMaHoa.push(maHoa);
    }
    console.dir("Array Mahoa ==>",arrMaHoa);
    var newbuff = Buffer.concat(arrMaHoa);
    console.log("New buff mã hóa ==>", newbuff);
    var strMaHoa = newbuff.toString("base64");
    console.log("strMaHoa base 64:", strMaHoa);
    return strMaHoa;
} 
////////////////////////////////
function GiaMaLongMess(msg,privateKey){
    var strdebase64 = new Buffer.from(msg,"base64");
    console.log("New buff giải mã ==>", strdebase64);
    var listGiaiMa = ChunkBuffGiaiMa(strdebase64, 256);
    var listGiaiMaSize = listGiaiMa.length;
    console.log("Buffer Array size GiaiMa ==> ",listGiaiMaSize);
    const iteratorGiaMa = listGiaiMa.values();
    var arrGiaiMa = [];

    for (const value of iteratorGiaMa) {
        console.dir("values giải mã array" ,value);
        var GiaiMa = GiaiMaBuff(value,privateKey);
        
        arrGiaiMa.push(GiaiMa);
    }
    console.dir("Buff GiaiMa",arrGiaiMa);
    var newbuffGiaiMa = Buffer.concat(arrGiaiMa);
    console.log("New buff newbuffGiaiMa ==> ", newbuffGiaiMa);
    var strGiaiMa = newbuffGiaiMa;
    console.log("strMaHoa base 64:", strGiaiMa);
    var FinalGiaiMa = strGiaiMa.toString("utf8");
    console.log("GiaiMa ==> ", FinalGiaiMa);
    return FinalGiaiMa;
}
console.log ("================================");
var strMaHoaLong = MaHoaLongMess(msg,VieONpublicKey);
console.log("Mã hóa dữ liệu dài ==> ",strMaHoaLong)
var strGiaiMaLong = GiaMaLongMess(strMaHoaLong,VieONprivateKey);
console.log("Giải mã dữ liệu dài ==>", strGiaiMaLong);
