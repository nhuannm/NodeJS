const fs = require('fs');
const NodeRSA = require('node-rsa');
var Request = require("request");
const crypto = require("crypto")

const SPTpublicKey = fs.readFileSync("./pem_files_dev/spt_public_dev.pem", { encoding: "utf8" });
const SPTprivateKey = fs.readFileSync("./pem_files_dev/spt_private_dev.pem", { encoding: "utf8" });
console.log ("SPT key: \n",SPTpublicKey);
console.log (SPTprivateKey);
const VieONpublicKey = fs.readFileSync("./pem_files_dev/vieon_public_dev.pem", { encoding: "utf8" });
const VieONprivateKey = fs.readFileSync("./pem_files_dev/vieon_private_dev.pem", { encoding: "utf8" });
console.log ("VieON key:\n",VieONpublicKey);
console.log (VieONprivateKey);

//Load key
const keyVieOnPrivate = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n'+
'MIIEpAIBAAKCAQEA80SJThXqYgVDSgBGtH8puQ3S3QxgvN9Tc89a4VWB+8XYwmHN\n'+
'uxh8rT5aneXORtNvKn01instLoqluG/R4+KkoMkWMu4EBMnDyztiNG9d+J85Ehzn\n'+
'ADdmxU08twpznlnUWEMEyVKA+2Mye/wObaeJb5xDhZZX4ajd1RMMEYR3OlUdzA3n\n'+
'+VHgMFipH3oMkEEuGd4geancCpHtw6BQL9rVRlu4wEU/huhC2Y34Yt3pfuC8q4Aq\n'+
'PsXmal1OIzXlcIhCcHbES5h6JIocRBNChb/08NR+Bu85nT4Iq+R9QynGFgL8aKgw\n'+
'nn+NqaHm16IXDQfj1+4G/cgcPe4p2FW57kbWTQIDAQABAoIBAQCI0yqbJc5vlWA0\n'+
'dhVOnhtcfz7zn2ulr8KjZ6RJCywR7USuiA4LxokRc/nJx6COy4tCDayYmBFglREC\n'+
'vLoD/8zytkdrG95cxxL98weYUG89UGjsHB99SqveG0Qj+5fuH75EamV9yo7LVg7m\n'+
'F24SFOJDSVPdBiOlw7IJjy4BiEz7HB3thcxUb1oR6YHN+0DltD35iadXwHZFp73O\n'+
'TOrAoy2hTGhC4JTI6ZQ2MWhexdpBUKyercBdEgtK4VUuQnwkcyHxi25tVEANM9vW\n'+
'uQXEkogqs45IVTar8B2cvyQrS4I357kLvUOEnGcSIC76sQsOMtSVkHLOebK79QCk\n'+
'IE3PgFoNAoGBAPp1NNZsTmgKvfwCcf4qT2TiR+f4vnhzdCoy9i74GZnWzO80n74q\n'+
'kEMmBOEE6ymHS14XX+PgyBWh8mRsedULS2hUpc/cgvBpqvTd+Zhfy3mXPLhNKQqN\n'+
'm+/3MXnJCV62z3nqdGpuKQSCCUsW04r281DGMUf3aCx9cTftcJ/U5fNXAoGBAPim\n'+
'mXB8zJYbF6dU7nNp5vQ6pvH0D+mkXgQVfWO/RC2wM5+KQ/qYqJvTo1NbUkyTGoM+\n'+
'7dcE4JFOV0IVvqNKMSIN443CtExcWAK7aekriy0s4gAwhf9+X3LImTMWyZLfXyxg\n'+
'64CrjpPG4M7ZNFlS0LWY3bm4LWj+SyUmZnB2MMD7AoGAXm20Rye8hAOQz6QIYICJ\n'+
'QIsD+1TQU0+MO6DNKrZFyLewuntHwwX/MCH0cvZMx3KIGuiLMbp9FZLidbRkVsuU\n'+
'WbiYb38/Ku9cEkhio21ypNw9e2s0DxOG+HllgPon+zrHjLq1u67e7iEs6c+oYFtt\n'+
'L0YaLHz+HNAK0MBH1ysIq68CgYBpk7ulAqiPt9M0TqCsyrOw0dKe+4ViLFNrIoDK\n'+
'QKU/TQiuXjP9DKLS/2ri8uyf7Pod7jNoz/5WVFBClB8NEGyKTCFpyNlrbu5DwrX2\n'+
'tnFy7hLMB85trIf0oe5CvhM61LOBkWmNicqRPqmnypwqrTpHUTAcMnK9mPPpQ0PN\n'+
'zrFmzwKBgQCKI6v2eYVfuaBEBexdntyVgXdvsoOMZeryzh2wtXpgodbX/o97SCql\n'+
'xl7Fa68cDyXNqD7XJJm8gRLh6InYYzcLy6t6Q2q3l6Psm/KFk12Har0OMlFBsGCr\n'+
'WNKPK8LkUw1fDfMSWCjz3mC5EQ9dsIfpjXExM+5fwVpEfpeikLEmRQ==\n'+
'-----END RSA PRIVATE KEY-----');
const keyVieOnPublic = new NodeRSA(VieONpublicKey);
/*
const keyVieOnPublic = new NodeRSA('-----BEGIN PUBLIC KEY-----\n'+
'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA80SJThXqYgVDSgBGtH8p\n'+
'uQ3S3QxgvN9Tc89a4VWB+8XYwmHNuxh8rT5aneXORtNvKn01instLoqluG/R4+Kk\n'+
'oMkWMu4EBMnDyztiNG9d+J85EhznADdmxU08twpznlnUWEMEyVKA+2Mye/wObaeJ\n'+
'b5xDhZZX4ajd1RMMEYR3OlUdzA3n+VHgMFipH3oMkEEuGd4geancCpHtw6BQL9rV\n'+
'Rlu4wEU/huhC2Y34Yt3pfuC8q4AqPsXmal1OIzXlcIhCcHbES5h6JIocRBNChb/0\n'+
'8NR+Bu85nT4Iq+R9QynGFgL8aKgwnn+NqaHm16IXDQfj1+4G/cgcPe4p2FW57kbW\n'+
'TQIDAQAB\n'+
'-----END PUBLIC KEY-----');
*/
keyVieOnPrivate.setOptions({signingScheme: 'pkcs1-sha256'});
keyVieOnPrivate.setOptions({encryptionScheme: 'pkcs1'});
keyVieOnPublic.setOptions({signingScheme: 'sha256'});
keyVieOnPublic.setOptions({encryptionScheme: 'pkcs1'});

const keySPT = new NodeRSA(SPTprivateKey);
/*
const keySPT = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n'+
'MIIEpAIBAAKCAQEA8WpUxJ9rRMl/2SoxEHaVjkFdSDCCujSjFd6Dmav/F1258c65\n'+
'+m/TUktcUGZ/OMbDdOmoRLa8ne5KcfDigm+HWh1o78kA7SFPl38qaINrJ02ol66J\n'+
'tlwo+N2eL9LwoSQzcS5YwIlx20VpJHmeBPYoxG1rQ03Wo/n6kL6S3g0PALjgqhiA\n'+
'dwbBNx3e2nyOlQ4SOcpqUp2/zKwjxH86++5o2pXKSEY23vLckz1u3EgFaeQ2AYp/\n'+
'w/QG1MM6i4cpQLAzbepCRvujKbb/9V8aV130HG6gYKzBmg98gZ7BQWUIyQF78rAd\n'+
'17BMrm4YqmABQZdf4PS3cDVp9Zs2XK9XidouaQIDAQABAoIBAQDkUPjcgBz2EE+e\n'+
'dd2zQUOOJ1ludZqdOjzm6OuzQUxer+C0xRt0s5+7G9SxoU4+xxSBlJ30ZpKaFoxH\n'+
'mFbQn2P2IQxmgsYifjeFAtp7v5ZutG53DbXmRuDlBMufVTMIY3FXYErFxPduNgYL\n'+
'Xg3JiXji1Mz1+T6/FCMaE3JZGSaQOXK8HdvFcvrIaBfNSY05CNWL2QuNw0Womhub\n'+
'MYkqcF/HhUP81gEpe7C9yWeGhPEyraI7pphQHG7+teph9MgGPY7XrI7joUuUEPwh\n'+
'PWz808vu2omVoSMo29U+X5YbzZ4V1ZHCNcMSMVt9KuLONAHvWqSF6ZUb8bCiI8r8\n'+
'yZ3eogsBAoGBAP6LMUtHDr2Sf/9FJMh1ILlUmkdOxiUbPxwdRXrO98VAzjy08+t3\n'+
'SeF7T3uAV8TP7DjSlZjjrOkdB0NbjbxKUZLwhN0KbjFTKfNJoJ2cK97gIA1RPKrG\n'+
'H4DnbgGjOIJRiUumnh9lL33+BoCZV5sR+2zHQw0AHKWjQhydvXLEffyJAoGBAPLL\n'+
'6R7cof/z/ThuyglY1plri0+6/AYD55/h4ztahtKe1bWnzKzfsgZ3YluPAOk34hHj\n'+
'LtNHbtt836z9wvjMM3X4uaFsJjk6CxwI3ytZ1k8IQ2NGtN4l112mjZh6QPy6RjwA\n'+
'2e2YiYxkOVF5qYvaUO53z4goikgXXZohMaVteurhAoGAQH1Lc+MA3Q6s1yPReegS\n'+
'7mF85OwUT3pjtt/DpqWhKJyOo9rEobeLRFFVhdiyY+65znur4xxrxnPQT0R22GmL\n'+
'2UqOnuHxoRWM31KcGtJiWwk1laorUKj5elMoD8ommv3FZyFDlniwW59sTlCLXYJk\n'+
'zN5/ImAQ4fZG3bEpOlaGBOECgYEAkVnli6ZGDXbBx0D8DrByeJJbajXknq1DwwF2\n'+
'CZheUkToZ8G21F9uslRSO8HWp8fevRqmc7G1+gw909BvIocM37kxWCPoliXbdMMS\n'+
'517234Vw4kP4D23UCqqk5f16XlIdrdpMnOLOpY9yiQYurBzcioaLZVXvwszKKnVo\n'+
'xUJPbcECgYAvH6Hl/j5U6Yc/aW+10lU+t4qOHBd8t7m2qbjiIes1jsxSNpB6z3on\n'+
'JrIZ3xY3beqprI1McruNoWvBz2Fnr72HI7kUfOIlLpAO6mEsFfxRuSbNAcNPYNmN\n'+
'fJZYjvzmyFYaLE0vGXqzxWw6lWLVjT7hsqobuhuAH405qRcP8kh+5w==\n'+
'-----END RSA PRIVATE KEY-----');
*/
keySPT.setOptions({signingScheme: 'sha256'});
keySPT.setOptions({encryptionScheme: 'pkcs1'});


//console.log ("Node-RSA VieON:\n\n ", keyVieOnPrivate);
//console.log ("Node-RSA VieON:\n\n ", keyVieOnPublic);
//console.log ("Node-RSA SPT Key:\n\n ",keySPT);



const strdata = '{"partner_code":"spt_dev","token":"vpe4Xfdege7rUpr9CmkyUVzQuW3xQekV","package_id":1}'
const strtaoaccount=strdata;//'{"partner_code":"spt_dev","token":"vpe4Xfdege7rUpr9CmkyUVzQuW3xQekV","phone":"09813366095"}'

const PostDataencrypted = keyVieOnPublic.encrypt(strtaoaccount, "base64");
console.log("Post data ma hoa:\n",PostDataencrypted);
console.log("Giai ma:\n",keyVieOnPrivate.decrypt(PostDataencrypted,"utf-8"));
//SPT Sign
//const hash = crypto.createHash('sha256').update(PostDataencrypted).digest("base64");
//console.log(hash);
//const SPTSig = keySPT.sign(hash,'base64');
const SPTSig = keySPT.sign(PostDataencrypted,'base64');
console.log("Chu ky:\n",SPTSig);
//Call API

function Post(url,data,signature){
	Request.post({
    "headers": { "content-type": "application/json" },
    "url": url,
	"body": JSON.stringify({
        "data": data,
        "signature": signature
		})
	}, (error, response, body) => {
    if(error) {
		console.log("Lỗi: ",error);
        return console.dir(error);
    }
	console.log("body: ",body);
    //console.dir(JSON.parse(body));
	});
}
Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",PostDataencrypted,SPTSig);

/*
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
console.log("decrypted data: ", decryptedData.toString())
const MahoaData = MaHoa(strtaoaccount,VieONpublicKey); 
console.log("Mahoa: ",MahoaData);
const GiaMaData = GiaiMa(MahoaData,VieONprivateKey)
console.log("Giai ma: ",GiaMaData);
// The signature method takes the data we want to sign, the
// hashing algorithm, and the padding scheme, and generates
// a signature in the form of bytes
/*
const signature = crypto.sign("RSA-SHA256", Buffer.from(MahoaData), {
	key: SPTprivateKey,
	padding: crypto.constants.RSA_PKCS1_PADDING,
})
*/
/*
var ALGORITHM= "SHA256"
var SIGNATURE_FORMAT = "base64"; // Accepted: hex, latin1, base64
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
/*
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



// isVerified should be `true` if the signature is valid
//console.log("signature verified: ", isVerified)
//call API
Request.get("https://dev-giftcode.vieon.vn/spt/health-check", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});
Post("https://dev-giftcode.vieon.vn/spt/package/v1/list",MahoaData,signature)

Request.post({
    "headers": { "content-type": "application/json" },
    "url": "https://dev-giftcode.vieon.vn/spt/package/v1/list",
    //"url": "https://dev-giftcode.vieon.vn/spt/user/v1/create",
	"body": JSON.stringify({
        "data": MahoaData,
        "signature": signature
    })
}, (error, response, body) => {
    if(error) {
		console.log("Lỗi: ",error);
        return console.dir(error);
    }
	console.log("body: ",body);
    console.dir(JSON.parse(body));
});
*/
//test