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
  
    // publicEncrypt() method with its parameters 
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
	Buffer.from(respdata,'base64'),
	{
		key: VieONpublicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING,
	},
	Buffer.from(respsig,'base64')
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

//test với chuỗi là json string gửi sang
app.post('/vieon/package/list/msg',(req, res) => {
	var msg = JSON.stringify(req.body);
	//var signature = req.body.signature;
	var data = MaHoa(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",data,signature)
		console.dir("dataPosPromis Function:",dataPosPromis);
		dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
		console.dir("VieON Repond Data: ", JSON.parse(dataPosPromis).data);	
		var VieONDataRespond = JSON.parse(dataPosPromis).data;
		var VieONDataDecrypt = GiaiMa(VieONDataRespond,SPTprivateKey);
		dataPosPromis1 = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey);
		res.send(JSON.parse(VieONDataDecrypt));
		
		
		//var datatest= VieONDataRepond; //"fS4tPtOlX2QegN9W4YrG2yepniFu6WxuBv3IIHd/DvHVyP38jcB/A8t30+++kX64SLQtxFnqtmHCNsldPW21Kz9c+KbKbNzoNS7/KEfXFXFgL46Vb8CtL/lagdAUmFn7BNZL6bLF7/+OTXRhFRSBajvJDq5b7FS94IdYRN0c1fIQiUdSrPlmrj2siN2aze8kP9y1LDHuYzu3o0Sqwp+RKuKyat2xYYzmKvBaTnWswNHkWC+NUSuKQzHn+oqczPI/GMY+V/C/WRM6H9jpVj/NmbHUo1soLJ65fFwCETYJ+Uq8nrVx10aGryrW887/qdDgQKe9yB/m95QqTZWV1ZhAmA==";
		//var dataPosPromis1 = GiaiMa(datatest,SPTprivateKey);
		//res.send(JSON.parse(dataPosPromis1));
		//console.dir("TEST: ", dataPosPromis1);
	} 
	   CallAPI();
	   
  });
  //tạo mới account
app.post('/vieon/spt/user/v1/create',(req, res) => {
	var msg = JSON.stringify(req.body);
	//var signature = req.body.signature;
	var data = MaHoa(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		//const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/user/v1/create",data,signature)
		//console.dir("dataPosPromis Function:",dataPosPromis);
		//dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
		//console.dir("VieON Repond Data: ", JSON.parse(dataPosPromis).data);	
		//var VieONDataRespond = JSON.parse(dataPosPromis).data;
		//var VieONDataDecrypt = GiaiMa(VieONDataRespond,SPTprivateKey);
		//dataPosPromis1 = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey);
		//res.send(JSON.parse(VieONDataDecrypt));
		//
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/user/v1/create",data,signature)
			console.dir("dataPosPromis Function:",dataPosPromis);
			dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)	
			console.dir("Dữ liệu VieON trả về ==> ",dataresp)
			res.send(JSON.parse(dataresp));
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
	var data = MaHoa(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/user/v1/reset-password",data,signature)
		console.dir("dataPosPromis Function:",dataPosPromis);
		dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)
		console.dir("VieON Repond Data: ", JSON.parse(dataPosPromis).data);	
		var VieONDataRespond = JSON.parse(dataPosPromis).data;
		var VieONDataDecrypt = GiaiMa(VieONDataRespond,SPTprivateKey);
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
	var data = MaHoa(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data: "+data+", Signature is: "+signature);
	//res.end("yes");
	async function CallAPI(){
		
		//console.dir("dataPosPromis Function:",dataPosPromis);
		//console.dir("VieON Repond Data: ", JSON.parse(dataPosPromis).data);	
		//var VieONDataRespond = JSON.parse(dataPosPromis).data;
		//var VieONDataDecrypt = GiaiMa(VieONDataRespond,SPTprivateKey);
		//res.send(JSON.parse(VieONDataDecrypt));
		//
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",data,signature)
			dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)	
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
  app.post('/vieon/spt/package/v1/active',(req, res) => {
	var msg = JSON.stringify(req.body);
	console.log("msg size:",Buffer.byteLength(msg));
	console.dir("Dữ liệu text SPT gửi sang VieON ==> ",msg);
	var data = MaHoa(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data: "+data+", Signature is: "+signature);
	async function CallAPI(){
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/active",data,signature)
			dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)	
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
	var data = MaHoa(msg,VieONpublicKey);
	var signature= TaoChuKySo(data,SPTprivateKey);
	console.log("Data: "+data+", Signature is: "+signature);
	async function CallAPI(){
		try {
			const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/renewal",data,signature)
			dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)	
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