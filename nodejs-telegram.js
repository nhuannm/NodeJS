const TelegramBot = require('node-telegram-bot-api');
const imagesToPdf = require("images-to-pdf");
const path = require("path");
const {insertPhoto} = require("./module-mssql");
//TelegramBot.EventEmitter.defaultMaxListeners = 25
// replace the value below with the Telegram token you receive from @BotFather
//const token = '309657799:AAFasIaS_y_jECX8UdCaagr0DXKOratvOcY';//'452206717:AAHZJ0k4GWUh_To5edjxTV_VO-gBe3lhocQ';
const token ='648930936:AAHYjDhFRYu7VqFEkOaakddkmdd7xxvo1aw';
// Create a bot that uses 'polling' to fetch new updates
//const bot = new TelegramBot(token, {polling: true});
const options = {
  polling: true
};
//var sleep = require('sleep');
var sleep = require('system-sleep');
var fs = require('fs');
const bot = new TelegramBot(token, options);
//
var grChck="340856233,548342921,1154767387,595535987,435463845,289025539,1025776881,816977189,1088997179,653817715,272703654,250501532,444589076,443870817,398068958,431300436,361218900,419828537";
 // config for your database
    var config = {
        user: 'sa',
        password: 'adminvoip177%',
        server: '127.0.0.1', 
        database: 'Telegram_log',
		options: {
		enableArithAbort: false,
		encrypt: false
		}
    };
//var express = require('express');
//var app = express();

var requestPost = require('request');
var sql = require("mssql");
  
    const request = new sql.Request();

// Matches "/echo [whatever]"
//bot.onText(/\/echo (.+)/, (msg, match) => {

bot.onText(/\/start/, (msg) => {
    
bot.sendMessage(msg.chat.id, "Welcome", {
"reply_markup": {
    "keyboard": [["Sample text", "Second sample"],   ["Keyboard"], ["I'm robot"],[{ text: "Location", request_location: true }],
			[{ text: "Contact", request_contact: true }]]
    }
});

//
bot.sendMessage(msg.chat.id, "How can we contact you?").then(() => {
        bot.on('contact',(msg)=>{
            var option = {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "one_time_keyboard": true,
                    "keyboard": [[{
                        text: "My location",
                        request_location: true
                    }], ["Cancel"]]
                }
            };
            bot.sendMessage(msg.chat.id,util.format('Thank you %s with phone %s! And where are you?', msg.contact.first_name, msg.contact.phone_number),option).then(() => {
                bot.on("location",(msg)=>{
                    bot.sendMessage(msg.chat.id, "We will deliver your order to " + [msg.location.longitude,msg.location.latitude].join(";"));
                });
            });
        });
    });
//
    
}); 
// Listen for any kind of message. There are different kinds of
// messages.

bot.on('message', (msg) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
// connect to your databaseconsole.log
var msg_id = msg.message_id;
var msg_date = msg.date;
var From_Id = msg.from.id;
var From_name = msg.from.first_name + " " + msg.from.last_name;
var chat_id = msg.chat.id;
var chat_name = msg.chat.first_name + " " + msg.chat.last_name;
var chat_title = msg.chat.title;
var chat_type =msg.chat.type;
var msg_text = msg.text;
var doc_filename = "";
var info_uri ="";
var msg_reply="";
const chatId = msg.chat.id;
console.log(msg);
if (msg.reply_to_message) {
	msg_reply = msg.reply_to_message.text + " ==>" + From_name + " Tra loi: " + msg.text;
	msg_text = msg_reply;
	//console.log(msg.text);
	}
console.log(msg_text);	
	//check group
	console.log(grChck.indexOf(msg.from.id));
	if(grChck.indexOf(msg.from.id) > 0 ) {
		console.log("Check ID in group,ok");
		console.log(grChck.indexOf(msg.from.id));
	
	bot.getChatMember(msg.chat.id, msg.from.id).then(function(data) {
		console.log("Member check:");
		console.log(data);
		if ((data.status == "creator") || (data.status == "member") || (data.status == "administrator")){
			//bot.sendMessage(msg.chat.id, "User in group!");
			//console.log(msg_text);
			console.log("Line 117:");
			sql.connect(config, err => {
			const request = new sql.Request()
			 
			request.input('msg_id',msg_id);
			request.input('msg_date',msg_date);
			request.input('From_Id',From_Id);
			request.input('From_name',From_name);
			request.input('chat_id',chat_id);
			request.input('chat_name',chat_name);
			request.input('chat_title',chat_title);
			request.input('chat_type',chat_type);
			request.input('msg_text',msg_text);
			request.input('doc_filename',doc_filename);
			request.input('info_uri',info_uri);
			
			var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri) "
			//console.log("Log sql 134: " + sqlInsert);
			request.query(sqlInsert,function (err, result) {
			if (err) throw err;
			console.log("Message Insert oki: " + result.rowsAffected);
			sql.close();
			
			}); // or requ
		  
		});
			
		}else{
			bot.sendMessage(msg.chat.id, "User not in group");
		}
	});
	}
//console.log(msg_id);
//console.log(msg_date);
//console.log(From_Id);
//console.log(From_name);
//console.log(chat_id);
//console.log(chat_name);
//console.log(chat_title);
//console.log(chat_type);

console.log("Line:141")

sql.on('error', err => {
    // ... error handler
   });
});


bot.on('photo',(msg) => {
    const chatId = msg.chat.id;
    const title = msg.chat.title
    var fileName = "";
    var UriFile = "";
    var msg_id = msg.message_id;
    var msg_date = msg.date;
    var From_Id = msg.from.id;
    var From_name = msg.from.first_name + " " + msg.from.last_name;
    var chat_id = msg.chat.id;
    var chat_name = msg.chat.first_name + " " + msg.chat.last_name;
    var chat_title = msg.chat.title;
    var chat_type = msg.chat.type;
    var msg_text = msg.caption;
	//sleep(1000);
    var fileId=msg.photo[msg.photo.length-1].file_id;
    //console.log('FileId: ' + fileId);
    console.dir(msg.photo);
    //end get file link
	if(grChck.indexOf(msg.from.id) > 0 ) {
		console.log("Check ID in group,ok");
		console.log(grChck.indexOf(msg.from.id));
		const fileStream = bot.getFileStream(fileId);
		//sleep(1000);
		fileStream.on('info', (info) => {
            fileName = info.uri.slice(info.uri.lastIndexOf('/') + 1);
	        UriFile = info.uri;
			  // TODO: Ensure fileName doesn't contains slashes
			//bot.stopPolling();	
			//check member
		    console.log("Line: 109");
			//write log file
			//var logFileName = 'C:\/ftp\/DownloadTelegramFile\/DownloadTelegramFile\/TelegramBot_SaveFile_Url\/'  + msg_id + '.txt';
			var logFileName = 'c:/Telegramsms/'  + msg_id + '.txt';
            var text = msg_date + ";" + From_name + ";"+ From_Id +";"+ chat_title + ";" + chat_type + ";" + chat_id +";" + msg_id + ";" + msg_text + ";" + fileName  + ";" + UriFile +'\r\n'; 
			console.log(logFileName);
			fs.appendFile(logFileName,text, function (err) {
				if (err) throw err;
				console.log('Log Saved!');
				});
			insertPhoto(msg_id,msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,fileName,UriFile,msgCaption)
                //sql.close();
			// async function InsertPhoto(){
            //     sql.connect(config, err => {
            //         const request = new sql.Request()   
            //         request.input('msg_id',msg_id);
            //         request.input('msg_date',msg_date);
            //         request.input('From_Id',From_Id);
            //         request.input('From_name',From_name);
            //         request.input('chat_id',chat_id);
            //         request.input('chat_name',chat_name);
            //         request.input('chat_title',chat_title);
            //         request.input('chat_type',chat_type);
            //         request.input('msg_text',msg_text);
            //         request.input('doc_filename',fileName);
            //         request.input('info_uri',UriFile);
            //         request.input('caption',msgCaption);
                    
            //         var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri,caption) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri,@msg_text) "
                    
                    
            //         //var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri) "
            //         request.query(sqlInsert,function (err, result) {
            //         if (err) throw err;
            //        // sql.close();
            //         //console.log(result);
            //         //console.log(bot.downloadFile(fileId,"c:/Telegramsms/")); //downloadFile vào ổ c:
            //         // var path = bot.downloadFile(fileId,"c:/Telegramsms/").then(function (path){
            //         //     console.log(path);
            //         //     //Convert Jpg to pdf
            //         // //await imagesToPdf(["c:/Telegramsms/" + fileName], "c:/Telegramsms/" + fileName);
            //         // //imagesToPdf(["c:/Telegramsms/" + fileName], "c:/Telegramsms/" + fileName);
            //         // //reply_mess
            //         //     const opts = {
            //         //         reply_to_message_id: msg.message_id
            //         //     }
            //         //     bot.sendMessage(msg.chat.id, "Save oki, thanks " + From_name, opts);
                        
            //         //   });
                    
                    
            //         // console.log("Line: 147");
            //         // //
            //         // if(result.rowsAffected = 1)
            //         // {
            //         //     //console.log("restart polling");
            //         //     //bot.startPolling();
            //         //     //sleep(1000); // sleep for 10 seconds
            //         // }
            //         // sql.close(); //fix: Cannot close a pool while it is connecting
            //         // //sleep(1000); // sleep for 10 seconds
            //         // //bot.startPolling();
            //       }); // or requ
            //       //sleep(3000);
            //       sql.close();
            //     });
            //         //sleep.sleep(1);
            //     sql.on('error', err => {
            //         // ... error handler
            //        });
            //        //bot.startPolling();
                
            //     } 
            //     //
            async function download (){
                console.log("Download photo:",fileId); //downloadFile vào ổ c:
                    await bot.downloadFile(fileId,"c:/Telegramsms/")
                    // const pathToFile = path.join("c:/Telegramsms/", fileName)
                    // const newPathToFile = path.join("c:/Telegramsms/", docName)
                    // try {
                    //     fs.renameSync(pathToFile, newPathToFile)
                    //     console.log("Successfully renamed the file!",{fileName,docName})
                    //   } catch(err) {
                    //     throw err
                    //   }
                    //await InsertPhoto();
                    const opts = {
                        reply_to_message_id: msg.message_id
                    }
                    bot.sendMessage(msg.chat.id, "Save oki, thanks " + From_name, opts);
               } 
                download();

			});
    }
	msgCaption=""
    //
    //console.log(bot.downloadFile(fileId,"c:/Telegramsms/")); //downloadFile vào ổ c:
});

bot.on('document',(msg) => {
    var docId = msg.document.file_id; // file id
    var docName = msg.document.file_name;
    var fileName = "";
    var UriFile = "";
    var msg_id = msg.message_id;
    var msg_date = msg.date;
    var From_Id = msg.from.id;
    var From_name = msg.from.first_name + " " + msg.from.last_name;
    var chat_id = msg.chat.id;
    var chat_name = msg.chat.first_name + " " + msg.chat.last_name;
    var chat_title = msg.chat.title;
    var chat_type = msg.chat.type;
    //var msg_text = "";
	 var msg_text = msg.caption;
console.dir("Document ==>\n",msg.document)

    //console.log(bot.getFile(docId));
   // var fileInfor = bot.getFile(docId);
    //var filePath = fileInfor.file_path;
    //get file link
   // console.log(bot.getFileLink(docId));
   if(grChck.indexOf(msg.from.id) > 0 ) {
		console.log("Check ID in group,ok");
		console.log(grChck.indexOf(msg.from.id));
		
   	bot.getChatMember(msg.chat.id, msg.from.id).then(function(data) {
		console.log("Member check:");
		console.log(data);
		if ((data.status == "creator") || (data.status == "member") || (data.status == "administrator")){
			//bot.sendMessage(msg.chat.id, "User in group!");
			 //end get file link
    const fileStream = bot.getFileStream(docId);
    fileStream.on('info', (info) => {
     //console.log(info);
       fileName = info.uri.slice(info.uri.lastIndexOf('/') + 1);
       UriFile = info.uri;
      // TODO: Ensure fileName doesn't contains slashes
      console.log(fileName);
      console.log(UriFile); 
      async function Insert() {sql.connect(config, err => {
                const request = new sql.Request()
                request.input('msg_id',msg_id);
                request.input('msg_date',msg_date);
                request.input('From_Id',From_Id);
                request.input('From_name',From_name);
                request.input('chat_id',chat_id);
                request.input('chat_name',chat_name);
                request.input('chat_title',chat_title);
                request.input('chat_type',chat_type);
                request.input('msg_text',msg_text);
                request.input('doc_filename',fileName);
                request.input('info_uri',UriFile);
                request.input('docName',docName);
				request.input('caption',msg_text);
				
                var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri,file_name,caption) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri,@docName,@caption) "
                request.query(sqlInsert,function (err, result) {
                if (err) throw err;
                console.log(result);
				sql.close()
                
              }); // or requ
              
              
            });
			
            sql.on('error', err => {
                // ... error handler
               });
            }
            //
            async function download (){
                console.log("Download file:",fileName); //downloadFile vào ổ c:
                    await bot.downloadFile(docId,"c:/Telegramsms/")
                    const pathToFile = path.join("c:/Telegramsms/", fileName)
                    const newPathToFile = path.join("c:/Telegramsms/", docName)
                    try {
                        fs.renameSync(pathToFile, newPathToFile)
                        console.log("Successfully renamed the file!",{fileName,docName})
                      } catch(err) {
                        throw err
                      }
                    await Insert();
                    const opts = {
                        reply_to_message_id: msg.message_id
                    }
                    bot.sendMessage(msg.chat.id, "Save oki, thanks " + From_name, opts);
               } 
                download();
    });
			
		}else{
			bot.sendMessage(msg.chat.id, "User not in group");
		}
	});
   }
   
   
    //console.log(bot.downloadFile(docId,"/"));
    // connect to your databaseconsole.log
	//Convert Jpg to pdf
	//await imagesToPdf(["path/to/image1.jpg", "path/to/image2.png"], "path/to/combined.pdf")
	
	//reply_mess
	
    msgCaption=""
});

//Last process all messages
bot.on('location', (msg) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
// connect to your databaseconsole.log
var msg_id = msg.message_id;
var msg_date = msg.date;
var From_Id = msg.from.id;
var From_name = msg.from.first_name + " " + msg.from.last_name;
var chat_id = msg.chat.id;
var chat_name = msg.chat.first_name + " " + msg.chat.last_name;
var chat_title = msg.chat.title;
var chat_type =msg.chat.type;
var msg_text = "location";
var doc_filename = "";
var info_uri ="";


const chatId = msg.chat.id;
//console.log(msg_id);
//console.log(msg_date);
//console.log(From_Id);
//console.log(From_name);
//console.log(chat_id);
//console.log(chat_name);
//console.log(chat_title);
//console.log(chat_type);
//console.log(msg_text);
//sql.close();
if(grChck.indexOf(msg.from.id) > 0 ) {
		console.log("Check ID in group,ok");
		console.log(grChck.indexOf(msg.from.id));
		
	bot.getChatMember(msg.chat.id, msg.from.id).then(function(data) {
		console.log("Member check:");
		console.log(data);
		if ((data.status == "creator") || (data.status == "member") || (data.status == "administrator")){
			//bot.sendMessage(msg.chat.id, "User in group!");
			    sql.connect(config, err => {
				const request = new sql.Request()
				 const latitude = msg.location.latitude.toString();
				const longitude = msg.location.longitude.toString();
				console.log(latitude);
				console.log(longitude);
				request.input('msg_id',msg_id);
				request.input('msg_date',msg_date);
				request.input('From_Id',From_Id);
				request.input('From_name',From_name);
				request.input('chat_id',chat_id);
				request.input('chat_name',chat_name);
				request.input('chat_title',chat_title);
				request.input('chat_type',chat_type);
				request.input('msg_text',msg_text);
				request.input('doc_filename',doc_filename);
				request.input('info_uri',info_uri);
				request.input('latitude',latitude);
				request.input('longitude',longitude);
				var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri,latitude,longitude) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri,@latitude,@longitude) "
				request.query(sqlInsert,function (err, result) {
				if (err) throw err;
				//console.log(result);
			   sql.close()
			  }); // or requ
			});
			 
			sql.on('error', err => {
				// ... error handler
			   });
			
		}else{
			bot.sendMessage(msg.chat.id, "User not in group");
		}
	});
}

});
