//VieON Gateway
//version 2. 2021-06-25 
// split buff to trunk with key size, to crypto, decrypto long message
//fix mã hóa, giãi mã với buffer lớn hơn key.size mã hóa
// Flow mã hóa và giải mã như sau:
// dữ liệu ==> buffer (binary) ==> cắt nhỏ dữ liệu = key size -11 octec ==> mã hóa từng buffer đã cắt: buffer public key (SPT) ==> 
// ==> ghép các buffer sau mã hóa .push() thành buff mới: Size buffer sau mã hóa = key size *2 ( 256 *2) * n số buff cắt
// ==> mã hóa base64 buffer đã mã hóa. Dữ liệu sau mã hóa publicket + base64 ==> ký số để gửi đi
// Giải mã:
// ==> kiểm tra chữ ký số, oki mới giải mã
// Dữ liệu nhận được ==> giải mã base64 ==> cắt nhỏ = size của key ==> giải mã từng phần ==> ghép lại push() ==> convert sang utf-8 to
const fs = require('fs');
var Request = require("request");
var rp = require('request-promise');
const crypto = require("crypto")
//time stamp 
const {timeStamp} = require("./nodejs-get-current systemtime");
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
const SPTKeySize = 512;
const SPTVieONSize = 256;
function MaHoa (plaintext, publicKey) { 
    const encrypted = crypto.publicEncrypt(
	{
		key: publicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING
		//oaepHash: "sha256",
	},
	// We convert the data string to a buffer using `Buffer.from`
	Buffer.from(plaintext) 
	)
    return encrypted.toString("base64"); 
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
//Giai ma promis asyn/await
async function GiaiMaPromiss (plaintext, privateKey) {
	var len = Buffer.byteLength(plaintext);
	console.log("Buffer length ==> ",len);
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
	try {
		return Promise.resolve(decryptedData.toString("utf8"));
	  }
	  catch (error) {
		return Promise.reject(error);
	  }
	//return decryptedData.toString("utf8");
}

//Tao chu ky
function TaoChuKySo(data,privatekey){
	const signature = crypto.sign("RSA-SHA256", Buffer.from(data,'base64'), {
	key: privatekey,
	padding: crypto.constants.RSA_PKCS1_PADDING,
	})
	return signature.toString("base64");
}
//Kiem tra chu ky
function KiemTraChuKy(data,signature,publickey){
	const isVerified = crypto.verify(
	"RSA-SHA256",
	Buffer.from(data,'base64'),
	{
		key: publickey,
		padding: crypto.constants.RSA_PKCS1_PADDING,
	},
	Buffer.from(signature,'base64')
	)
	return isVerified;
}
//use request-promiss
async function PostPromis(url,data,signature){
	var options = {
		headers: {"Content-Type": "application/json"},
		method: 'POST',
		uri: url,
		body: JSON.stringify({
			"data": data,
			"signature": signature
		})//{
			//some: {"data": data,"signature": signature}
			//SON.stringify
		//},
		//json: true // Automatically stringifies the body to JSON
	};
	/* rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
		console.log("PostPromis data respond:==> \n",parsedBody);
		return parsedBody;
    })
    .catch(function (err) {
        // POST failed...
		console.log("PostPromis errors: \n",err);
    }); */
	try {
		const response = await rp(options);
		console.log("Function promis resolve:\n",response)
		return Promise.resolve(response);
	  }
	  catch (error) {
		return Promise.reject(error);
	  }
	  
}
//2021-06-25
function ChunkBuff(msg, size){
    var maxLength = size;
    var dataLength = Buffer.byteLength(msg);
    var int = Math.floor(dataLength / maxLength);
    var int2 = dataLength % maxLength;
    if (int2 = 0) { //Nếu datalength = n * key size. thì băm nhỏ = băm -1
        int = int -1;
    } 
    var msgbuff = Buffer.from(msg);
   console.log(timeStamp() + " Mã hóa chunk msg buffer dataLength: ", dataLength);
   console.log(timeStamp() + " Mã hóa chunk msg buffer elements: ", int);
    var result = [];
    var mahoa = [];
    var start, count;
    var encrypted;
    for (i=0; i<=int; i++){
       // console.log("i=",i);
        start = maxLength * i;
        count = maxLength;
        if (i == int){
            count = dataLength - start;
           // console.log("i=int",start);
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
   console.log(timeStamp() + " Giải mã chunk msg buffer dataLength: ", dataLength);
   console.log(timeStamp() + " Giải mã chunk msg buffer elements: ", int);
    var result = [];
    var mahoa = [];
    var start, count;
    var encrypted;
    for (i=0; i<=int; i++){
        //console.log("i=",i);
        start = maxLength * i;
        count = maxLength;
        if (i == int){
            count = dataLength - start;
            //console.log("i=int",start);
        }
        result.push(msgbuff.slice(start, start+count));
       
    }
   return result;
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
function MaHoaLongMess(msg,publicKey) {
    var list = ChunkBuff(msg, 215);
    var listSize = list.length;
    //console.log(list);
    //console.log("Buffer Array size ==> ",listSize);
    const iterator = list.values();
    var arrMaHoa = [];
    for (const value of iterator) {
        
        var maHoa = MaHoaBuff(value,publicKey);
       // console.dir("values mã hóa: " ,maHoa);
        arrMaHoa.push(maHoa);
    }
    //console.dir("Array Mahoa ==>",arrMaHoa);
    var newbuff = Buffer.concat(arrMaHoa);
    //console.log("New buff mã hóa ==>", newbuff);
    var strMaHoa = newbuff.toString("base64");
    //console.log("strMaHoa base 64:", strMaHoa);
    return strMaHoa;
} 
////////////////////////////////
function GiaiMaLongMess(msg,privateKey){
    var strdebase64 = new Buffer.from(msg,"base64");
    //console.log("New buff giải mã ==>", strdebase64);
    var listGiaiMa = ChunkBuffGiaiMa(strdebase64, 512);
    var listGiaiMaSize = listGiaiMa.length;
    //console.log("Buffer Array size GiaiMa ==> ",listGiaiMaSize);
    const iteratorGiaMa = listGiaiMa.values();
    var arrGiaiMa = [];

    for (const value of iteratorGiaMa) {
        //console.dir("values giải mã array" ,value);
        var GiaiMa = GiaiMaBuff(value,privateKey);
        
        arrGiaiMa.push(GiaiMa);
    }
    //console.dir("Buff GiaiMa",arrGiaiMa);
    var newbuffGiaiMa = Buffer.concat(arrGiaiMa);
    //console.log("New buff newbuffGiaiMa ==> ", newbuffGiaiMa);
    var strGiaiMa = newbuffGiaiMa;
    //console.log("strMaHoa base 64:", strGiaiMa);
    var FinalGiaiMa = strGiaiMa.toString("utf8");
    //console.log("GiaiMa ==> ", FinalGiaiMa);
    return FinalGiaiMa;
}
//test với chuỗi là json string gửi sang
app.post('/vieon/package/list/msg',(req, res) => {
	var msg = JSON.stringify(req.body);
	//var signature = req.body.signature;
	//var data = MaHoa(msg,VieONpublicKey);
    var data = MaHoaLongMess(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",data,signature)
		console.dir(timeStamp() + " dataPosPromis Function:",dataPosPromis);
		dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
		console.dir(timeStamp() + " VieON Repond Data: ", JSON.parse(dataPosPromis).data);	
		var VieONDataRespond = JSON.parse(dataPosPromis).data;
		//var VieONDataDecrypt = GiaiMa(VieONDataRespond,SPTprivateKey);
        var VieONDataDecrypt = GiaiMaLongMess(VieONDataRespond,SPTprivateKey);
		//dataPosPromis1 = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey);
		res.send(JSON.parse(VieONDataDecrypt));
	} 
	   CallAPI();
	   
  });
  //tạo mới account
app.post('/vieon/spt/user/v1/create',(req, res) => {
	var msg = JSON.stringify(req.body);
	//var signature = req.body.signature;
	//var data = MaHoa(msg,VieONpublicKey);
	var data = MaHoaLongMess(msg,VieONpublicKey);
    var signature= TaoChuKySo(data,SPTprivateKey);
	console.log(timeStamp() + " Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		//
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/user/v1/create",data,signature)
			console.dir(timeStamp() + " dataPosPromis Function:",dataPosPromis);
			//dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
            var isVerify = KiemTraChuKy(JSON.parse(dataPosPromis).data,JSON.parse(dataPosPromis).signature,VieONpublicKey);
            if (isVerify == true){
                console.log(timeStamp(),"Dữ liệu kiểm tra chữ ký đúng VieON!");
                dataresp = GiaiMaLongMess(JSON.parse(dataPosPromis).data,SPTprivateKey);	
			    console.dir(timeStamp() + " Dữ liệu VieON trả về ==> ",dataresp)
			    res.send(JSON.parse(dataresp));
            }
		} catch (error) {
			console.dir(error.error);
			//res.status(200).json(error.error)	// không parse được object json, error.error đã là json rồi
			res.status(200).send(error.error)
			//res.send(error.message)
		}
	} 
	   CallAPI();
  });
//reset password
app.post('/vieon/spt/user/v1/reset-password',(req, res) => {
	var msg = JSON.stringify(req.body);
	//var signature = req.body.signature;
	//var data = MaHoa(msg,VieONpublicKey);
	var data = MaHoaLongMess(msg,VieONpublicKey);
    var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/user/v1/reset-password",data,signature)
		console.dir("dataPosPromis Function:",dataPosPromis);
		dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
		console.dir("VieON Repond Data: ", JSON.parse(dataPosPromis).data);	
		var VieONDataRespond = JSON.parse(dataPosPromis).data;
		//var VieONDataDecrypt = GiaiMa(VieONDataRespond,SPTprivateKey);
		var VieONDataDecrypt = GiaiMaLongMess(VieONDataRespond,SPTprivateKey);
        //dataPosPromis1 = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey);
		res.send(JSON.parse(VieONDataDecrypt));
	} 
	   CallAPI();
	   
  });
  //lấy danh sách gói cước
  app.post('/vieon/spt/package/v1/list',(req, res) => {
	var msg = JSON.stringify(req.body);
	console.dir("Dữ liệu text SPT gửi sang VieON ==> ",msg);
	//var signature = req.body.signature;
	//var data = MaHoa(msg,VieONpublicKey);
	var data = MaHoaLongMess(msg,VieONpublicKey);
    var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data: "+data+", Signature is: "+signature);
	//res.end("yes");
	async function CallAPI(){
		//
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",data,signature)
			//dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
            var dataresp = GiaiMaLongMess(JSON.parse(dataPosPromis).data,SPTprivateKey);		
			console.dir("Dữ liệu VieON trả về ==> ",dataresp)
			res.send(JSON.parse(dataresp));
		} catch (error) {
			console.dir(error);
			res.status(200).json({ 'error': error })	
			//res.send(error.message)
		}
		//
	} 
	   CallAPI();  
  }); 
  // Kích hoạt gói dịch vụ cho khách hàng
  app.post('/vieon/spt/package/v1/activate',(req, res) => {
	var msg = JSON.stringify(req.body);
	console.log("msg size:",Buffer.byteLength(msg));
	console.dir("Dữ liệu text SPT gửi sang VieON ==> ",msg);
	//var data = MaHoa(msg,VieONpublicKey);
	var data = MaHoaLongMess(msg,VieONpublicKey);
    var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data: "+data+", Signature is: "+signature);
	async function CallAPI(){
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/activate",data,signature)
			//dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
            var dataresp = GiaiMaLongMess(JSON.parse(dataPosPromis).data,SPTprivateKey);		
			console.dir("Dữ liệu VieON trả về ==> ",dataresp);
			res.send(JSON.parse(dataresp));
		} catch (error) {
			console.dir(error);
			res.status(200).json({ 'error': error })	
			//res.send(error.message)
		}
	} 
	   CallAPI();
  }); 
// Gia hạn dịch vụ cho khách hàng
app.post('/vieon/spt/package/v1/renewal',(req, res) => {
	var msg = JSON.stringify(req.body);
	//var data = MaHoa(msg,VieONpublicKey);
    console.dir("Dữ liệu text SPT gửi sang VieON ==> ",msg);
	var data = MaHoaLongMess(msg,VieONpublicKey);
    var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data: "+data+", Signature is: "+signature);
	async function CallAPI(){
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/renewal",data,signature)
			//dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
            var dataresp = GiaiMaLongMess(JSON.parse(dataPosPromis).data,SPTprivateKey);		
			console.dir("Dữ liệu VieON trả về ==> ",dataresp)
			res.send(JSON.parse(dataresp));
		} catch (error) {
			console.dir(error);
			res.status(200).json({ 'error': error })	
			//res.send(error.message)
		}
	} 
	   CallAPI();
  }); 
app.get('/check', (req, res) => {
	Request.get("https://dev-giftcode.vieon.vn/spt/health-check", (error, response, body) => {
    if(error) {
        //return console.dir(error);
		console.log(error);
    }
	if(response.statusCode==200){
		console.dir(JSON.parse(body));
		res.send(JSON.parse(body));
	} else {
	console.log("Lỗi kết nối WS VieON: code", response.statusCode)
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