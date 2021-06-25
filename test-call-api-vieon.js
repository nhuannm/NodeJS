var Request = require("request");
//test
const MahoaDataTest="ex8e4Q3c3/uhn+TlyHNunl98/Nd1S/hmC05zvWiKo001uYbfzO1GcILIF/ipetSC/yN9yJgfTeKKlzxxavfTd/lslqe3lTCUAVgkoZL/E/t2Pnp3z6xM7p++FMEeKH+zvSGdmKod4JZxaTB4AWwxdUT9amLvdeC8PieMv+8YPQmp3QpLPd5+grKAiZVVtaJF0V+q7rw4JRv34RQ5HeG3SlcVUsmmip5Jk3fHMe3aJklHg+lWwW07MJOYqKmrWvoxUuLWUCrY7R601ROM04n1QQEilwNdABHqJJZKxrqzJ4Z4Q9yJJE8/sP1r8DLTXXXrWI/KhI283jeW8RX1hUF9YA=="
const signatureTest="gwwNpoATaUXKi2TiuXfu6NshnhAT/8XF2mjbbROb8ydjzQCEFJWqXwI01Ng6xyzi7YVhE5pkLX3VhaU9Ef9QKJY7r4vwOpbmu/7rs0toWOXtCJ8G1QfsG5X8RAVCx0NlSGDYLlrSYWNY7Kb3mtzjDXqC/5pyjjbRLyoxshcZo/i1W7xJRDkkAHt6p7H/zkd52cBACkUCrG4B+FCguxYPcInu9aLMoxNwDBjdofXgXbkdwLFLFY+oczoiJhAhoIZXSVSHux1MKo+im7wDdCdYi/Y/yKTClWRHf/jtEqZ0SIAwhLqVeo4CwapuytlQPqaDR5YH9Hr93GPrWyJhz3Hu4g=="

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
		console.log("data:\n",JSON.parse(body).data)
		//console.log("VieON Respond:\n",GiaiMa(JSON.parse(body).data,SPTprivateKey))
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