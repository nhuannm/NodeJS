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
const SPTpublicKey = fs.readFileSync("./pem_files_dev/spt_public_dev.pem", { encoding: "utf8" });
const SPTprivateKey = fs.readFileSync("./pem_files_dev/spt_private_dev.pem", { encoding: "utf8" });
//console.log (SPTpublicKey);
//console.log (SPTprivateKey);
const VieONpublicKey = fs.readFileSync("./pem_files_dev/vieon_public_dev.pem", { encoding: "utf8" });
const VieONprivateKey = fs.readFileSync("./pem_files_dev/vieon_private_dev.pem", { encoding: "utf8" });
//console.log (VieONpublicKey);
//console.log (VieONprivateKey);

const strdata = '{"partner_code":"spt_dev","token":"vpe4Xfdege7rUpr9CmkyUVzQuW3xQekV","package_id":5}'
const strtaoaccount=strdata;//'{"partner_code":"spt_dev","token":"vpe4Xfdege7rUpr9CmkyUVzQuW3xQekV","phone":"09813366095"}'
const encryptedData = crypto.publicEncrypt(
	{
		key: VieONpublicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING
		//oaepHash: "sha256",
	},
	// We convert the data string to a buffer using `Buffer.from`
	Buffer.from(strtaoaccount)
)
console.log("encypted data: ", encryptedData.toString("base64"))


// Creating a function to encrypt string 
function encryptString (plaintext, publicKey) { 
    //const publicKey = fs.readFileSync(publicKeyFile, "utf8"); 
  
    // publicEncrypt() method with its parameters 
    const encrypted = crypto.publicEncrypt( 
         publicKey, Buffer.from(plaintext)); 
    return encrypted.toString("base64"); 
} 
//  const encrypted = encryptString(strtaoaccount,VieONpublicKey); 
 // console.log("Encrypted:", encrypted);

const decryptedData = crypto.privateDecrypt(
	{
		key: VieONprivateKey,
		// In order to decrypt the data, we need to specify the
		// same hashing function and padding scheme that we used to
		// encrypt the data in the previous step
		padding: crypto.constants.RSA_PKCS1_PADDING
		//oaepHash: "sha256",
	},
	encryptedData
)

// The decrypted data is of the Buffer type, which we can convert to a
// string to reveal the original data

// The signature method takes the data we want to sign, the
// hashing algorithm, and the padding scheme, and generates
// a signature in the form of bytes
/*
const signature = crypto.sign("RSA-SHA256", Buffer.from(MahoaData,'base64'), {
	key: SPTprivateKey,
	padding: crypto.constants.RSA_PKCS1_PADDING,
})
*/

/*
var ALGORITHM= "SHA256"
//var SIGNATURE_FORMAT = "base64"; // Accepted: hex, latin1, base64
function getSignatureToVerify(data) {

 var sign = crypto.createSign(ALGORITHM);
 sign.update(data);
 var signature = sign.sign(SPTprivateKey, SIGNATURE_FORMAT);

console.log(">>> Signature:\n\n" + signature);

return signature;
}
var signature = getSignatureToVerify(MahoaData);

console.log("SPT sig: ",signature.toString("base64"))
//verify
var verify = crypto.createVerify(ALGORITHM);
verify.update(MahoaData);
var verification = verify.verify(SPTpublicKey, signature, SIGNATURE_FORMAT);
console.log('\n>>> Verification result: ' + verification.toString().toUpperCase());
*/
// To verify the data, we provide the same hashing algorithm and
// padding scheme we provided to generate the signature, along
// with the signature itself, the data that we want to
// verify against the signature, and the public key
/*
const isVerified = crypto.verify(
	"SHA256",
	SIGNATURE_FORMAT,
	Buffer.from(MahoaData),
	{
		key: SPTpublicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING
	},
	signature
)
*/
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
	return decryptedData.toString("utf8");
}
//Giai ma promis asyn/await
async function GiaiMaPromiss (plaintext, privateKey) {
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
var datavieon
function Post(url,data,signature) {
	var respdata = 0
	try {
		const result = Request.post({
            "headers": { "content-type": "application/json" },
            "url": url,
            "body": JSON.stringify({
                "data": data,
                "signature": signature
            })
        }, (error, response, body) => {
            //console.log("response:\n ",response.statusCode, response.statusMessage);
            if (error) {
                console.log("Lỗi: ", error);
                //return console.dir(error);
            }
            //console.log("body: ",body);
            if (response.statusCode == 200) {
                //console.dir(JSON.parse(body));
                //console.log("data:\n",JSON.parse(body).data)
                //console.log("VieON Respond:\n",GiaiMa(JSON.parse(body).data,SPTprivateKey))
                //console.log("signature:\n",JSON.parse(body).signature)
                //console.log("error code:\n",JSON.parse(body).error_code)
                //console.log("signature status:\n",JSON.parse(body).success)
                //dataresp = GiaiMa(JSON.parse(body).data,SPTprivateKey)
                respdata = (GiaiMa(JSON.parse(body).data, SPTprivateKey));
				return respdata	
            } else {
                console.log("Lỗi kết nối WS VieON code ==> ", response.statusCode);
				datavieon = "TEST return"
               // return response.statusCode;
               //
            }
            //console.log("Result call API VieON:\n",respdata);
            //return JSON.stringify(respdata);//.toString("utf8");
        });	
		return respdata;
	}
	catch(err) {
		// catches errors both in fetch and response.json
		console.log("async function post error:\n",err);
	  }
	  //return respdata
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


// isVerified should be `true` if the signature is valid
//console.log("signature verified: ", isVerified)
//call API
Request.get("https://dev-giftcode.vieon.vn/spt/health-check", (error, response, body) => {
    if(error) {
        //return console.dir(error);
		console.log(error);
    }
	if(response.statusCode==200){
		console.dir(JSON.parse(body));
	} else {
	//	console.log("Lỗi kết nối WS VieON: code", response.statusCode)
	}
});
//console.log("decrypted data: ", decryptedData.toString())
const MahoaData = MaHoa(strtaoaccount,VieONpublicKey); 
console.log("Mã hóa dữ liệu:\n\n ",MahoaData);
const GiaMaData = GiaiMa(MahoaData,VieONprivateKey)
console.log("Giai ma:\n\n ",GiaMaData);
const signature = TaoChuKySo(MahoaData,SPTprivateKey)
console.log("Tạo chữ ký số:\n\n",signature);
//Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)

//test
const MahoaDataTest="ex8e4Q3c3/uhn+TlyHNunl98/Nd1S/hmC05zvWiKo001uYbfzO1GcILIF/ipetSC/yN9yJgfTeKKlzxxavfTd/lslqe3lTCUAVgkoZL/E/t2Pnp3z6xM7p++FMEeKH+zvSGdmKod4JZxaTB4AWwxdUT9amLvdeC8PieMv+8YPQmp3QpLPd5+grKAiZVVtaJF0V+q7rw4JRv34RQ5HeG3SlcVUsmmip5Jk3fHMe3aJklHg+lWwW07MJOYqKmrWvoxUuLWUCrY7R601ROM04n1QQEilwNdABHqJJZKxrqzJ4Z4Q9yJJE8/sP1r8DLTXXXrWI/KhI283jeW8RX1hUF9YA=="
const signatureTest="gwwNpoATaUXKi2TiuXfu6NshnhAT/8XF2mjbbROb8ydjzQCEFJWqXwI01Ng6xyzi7YVhE5pkLX3VhaU9Ef9QKJY7r4vwOpbmu/7rs0toWOXtCJ8G1QfsG5X8RAVCx0NlSGDYLlrSYWNY7Kb3mtzjDXqC/5pyjjbRLyoxshcZo/i1W7xJRDkkAHt6p7H/zkd52cBACkUCrG4B+FCguxYPcInu9aLMoxNwDBjdofXgXbkdwLFLFY+oczoiJhAhoIZXSVSHux1MKo+im7wDdCdYi/Y/yKTClWRHf/jtEqZ0SIAwhLqVeo4CwapuytlQPqaDR5YH9Hr93GPrWyJhz3Hu4g=="
//console.log("Test Post data sample:\n\n",Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaDataTest,signatureTest));
const respdata = "E7f6ExYdNA9Pp+F8Yzmh+I+fuMsxCoyRXwjeHprqrXNHv1E9yDHxnnSv95eF2r42N9z2pK+DJTBub+XT08f8FuezhwHFh2MU5mY3AvUbCKnTUykvnwpo0cF/P5Kc/VUKTXuebBNnMY7nXWf3IUtlg6ticedYIBw30PFsp87X7uSr/nkLIZJ0dTMlqoDBD+BeU7pr0yoeM5LThkeuf0RBNJIyoSxANjptwHoJv1nsky8qtQ/NRDlKMn/HGcQCcsB0zkXikOFpPAU4cPbTNhBXkCUfQJosjsRY3LWG6QvK7ygrRIakeHxI8vXXihoOG+/wc0UHQdEaxR3SYFUZVsJkuA=="
const respsig = "NDcJVVXKuK9Pva1C+jEYp2s58MogTWCQtocdc6ncc6oS0kkYb5ERG/GP2VKVELgSSwTkdjUfY0l5g9TB1lZvEX7VpoXKZRwnhW/kOPNrETODDZyztklNOdDNvTbPCuE08xlag37LLlLhyn2zm0gLySPeZtWx7iDS+XSD63aoHhm0BPYXB8OsYBdl8BaC71Fk4Fez8HpaOraKVi1MErMButTmn4qEXLzzJ5tFl8zSvDT6RoWfCml+i5j/OCLF2wAgmdgM6faISPXIL+A0z5i6983CQKeBrpNzlqRFE2k2RGX2wiCsCMBiFS0oxp454h54DySRX02pwVu5gCCVlMGfmQ=="
//base64 oki
const isVerified = crypto.verify(
	"RSA-SHA256",
	Buffer.from(respdata,'base64'),
	{
		key: VieONpublicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING,
	},
	Buffer.from(respsig,'base64')
)

console.log("signature verified: ", isVerified);
console.log("Kiem tra chu ky so:\n",KiemTraChuKy(respdata,respsig,VieONpublicKey));

//console.log("datapost test:\n", Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature));
//PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature);

Request.post({
	headers: { "content-type": "application/json" },
	url: 'https://dev-giftcode.vieon.vn/spt/package/v1/list',
	body: JSON.stringify({
		"data": MahoaDataTest,
		"signature": signatureTest
	})
}, (error, response, body) => {
	//console.log("response:\n ",response.statusCode, response.statusMessage);
	console.dir("response Request Post:\n ",response);
	if (error) {
		console.log("Lỗi: ", error);
		//return console.dir(error);
	}
	//console.log("body: ",body);
	if (response.statusCode == 200) {
		//console.dir(JSON.parse(body));
		//console.log("data:\n",JSON.parse(body).data)
		console.log("VieON Respond:\n",GiaiMa(JSON.parse(body).data,SPTprivateKey))
		//console.log("signature:\n",JSON.parse(body).signature)
		//console.log("error code:\n",JSON.parse(body).error_code)
		//console.log("signature status:\n",JSON.parse(body).success)
		//dataresp = GiaiMa(JSON.parse(body).data,SPTprivateKey)	
	} else {
		console.log("Lỗi kết nối WS VieON code (1)==> ", response.statusCode);
	   // return response.statusCode;
	   //

	}
});
//
var id = 2;

app.get('/post', (request, response) => {
	//response.setHeader('Content-Type', 'application/json');
   // First read existing users.
   var data = Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature);
   console.dir("SPT call WS:\n",data);
   //response.send(JSON.stringify(data));
	//response.send(Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)); 
   //console.log(Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature));
   response.json(data);
});
app.get('/post2', (request, response) => {
	//response.setHeader('Content-Type', 'application/json');
   // First read existing users.
   async function CallAPI(){
	//const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)
	const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaDataTest,signatureTest)
	console.dir("dataPosPromis Function:",dataPosPromis);
	dataresp = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey)	
	response.send(JSON.parse(dataresp));
   }  
   CallAPI();
   //response.send(JSON.stringify(data));
	//response.send(Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)); 
   //console.log(Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature));
   
});
app.get('/checkpacket', (request, response) => {
	//response.setHeader('Content-Type', 'application/json');
   // First read existing users.
   async function CallAPI(){
	const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)
	console.dir("dataPosPromis Function:",dataPosPromis);
	dataresp = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey)	
	response.send(JSON.parse(dataresp));
   }  
   CallAPI();
   //response.send(JSON.stringify(data));
	//response.send(Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)); 
   //console.log(Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature));
   
});
app.get('/localcheck',(req,res) => {
	Request.post({
		headers: { "content-type": "application/json" },
		url: 'http://localhost:8081/login',
		body: JSON.stringify({
			"user": "nhuan",
			"password": "nhuan"
		})
	}, (error, response, body) => {
		if (error) {
			console.log("Lỗi: ", error);
			//return console.dir(error);
		}
		//console.log("body: ",body);
		if (response.statusCode == 200) {
			res.send(response.body);
		} else {
			console.log("Lỗi localcheck ==> ", response.statusCode);
		}
	})
	
});
//test call API với data,signature đã mã hóa
app.post('/vieon/package/list',(req, res) => {
	var data = req.body.data;
	var signature = req.body.signature;
	console.log("Data = "+data+", Signature is "+signature);
	//res.end("yes");
	async function CallAPI(){
		const dataPosPromis = await PostPromis("https://dev-giftcode.vieon.vn/spt/package/v1/list",data,signature)
		console.dir("dataPosPromis Function:",dataPosPromis);
		//dataresp = await GiaiMaPromiss(JSON.parse(dataPosPromis).data,SPTprivateKey)	
		//res.send(JSON.parse(dataresp));
		dataPosPromis = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey)
		res.send(dataPosPromis);
	   }  
	   CallAPI();

  });
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
		//dataPosPromis1 = GiaiMa(JSON.parse(dataPosPromis).data,SPTprivateKey);
		res.send(JSON.parse(VieONDataDecrypt));
		//res.send(dataPosPromis);
		
		//var datatest= VieONDataRepond; //"fS4tPtOlX2QegN9W4YrG2yepniFu6WxuBv3IIHd/DvHVyP38jcB/A8t30+++kX64SLQtxFnqtmHCNsldPW21Kz9c+KbKbNzoNS7/KEfXFXFgL46Vb8CtL/lagdAUmFn7BNZL6bLF7/+OTXRhFRSBajvJDq5b7FS94IdYRN0c1fIQiUdSrPlmrj2siN2aze8kP9y1LDHuYzu3o0Sqwp+RKuKyat2xYYzmKvBaTnWswNHkWC+NUSuKQzHn+oqczPI/GMY+V/C/WRM6H9jpVj/NmbHUo1soLJ65fFwCETYJ+Uq8nrVx10aGryrW887/qdDgQKe9yB/m95QqTZWV1ZhAmA==";
		//var dataPosPromis1 = GiaiMa(datatest,SPTprivateKey);
		//res.send(JSON.parse(dataresp));
		//console.dir("TEST: ", dataPosPromis1);
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