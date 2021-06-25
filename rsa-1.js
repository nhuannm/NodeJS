const fs = require('fs');
//var fs=require ("fs")
var Request = require("request");
const crypto = require("crypto")
const SPTpublicKey = fs.readFileSync("./pem_files_dev/spt_public_dev.pem", { encoding: "utf8" });
const SPTprivateKey = fs.readFileSync("./pem_files_dev/spt_private_dev.pem", { encoding: "utf8" });
console.log (SPTpublicKey);
console.log (SPTprivateKey);
const VieONpublicKey = fs.readFileSync("./pem_files_dev/vieon_public_dev.pem", { encoding: "utf8" });
const VieONprivateKey = fs.readFileSync("./pem_files_dev/vieon_private_dev.pem", { encoding: "utf8" });
console.log (VieONpublicKey);
console.log (VieONprivateKey);

const strdata = '{"partner_code":"spt_dev","token":"vpe4Xfdege7rUpr9CmkyUVzQuW3xQekV","package_id":1}'
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

function Post(url,data,signature){
	Request.post({
    "headers": { "content-type": "application/json" },
    "url": url,
    //"url": "https://dev-giftcode.vieon.vn/spt/user/v1/create",
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
//test