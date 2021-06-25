const sql = require('mssql');

let employees=[];
 // config for your database
 var config = {
    user: 'sa',
    password: 'adminvoip177%',
    server: 'localhost', 
    database: 'Telegram_log',
    port: 1433,
    options: {
        max: 20,
    enableArithAbort: false,
    encrypt: false
    }
};
require('log-timestamp');
console.log("Start");
async function queryDb (queryParm) {
    var pool = await sql.connect(config);
    var data = await pool.request()
        .input('pr',sql.NVarChar,queryParm)
        .query("Select * from Telegram_log where from_id=@pr");
       // Store each record in an array
       for (let i=0;i<data.rowsAffected;i++){
            employees.push(data.recordset[i]);
           // require('log-timestamp');
           // console.log("rows: ",i);
       }
 pool.close;
 sql.close;
return employees;
}
// async function invocation
// queryDb('250501532')
//  .then(result=>{
//     result.forEach(item=>{
//       //  require('log-timestamp');
//        // console.log("call query");
//             console.log(item);
//         });
// })
//  .catch(err=>{
//    pool.close;
//    sql.close;
//      console.log(err)
//  })
 
 //Insert SQL bot.mes(photo)
async function insertPhoto(msg_id,msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,fileName,UriFile,msgCaptio) {
    var pool = await sql.connect(config);
    var request = await pool.request()
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
        request.input('caption',msgCaption);        
        var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri,caption) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri,@msg_text) "
						//var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri) "
		request.query(sqlInsert,function (err, result) {
            console.log("insert to database oki,:",result.rowsAffected);
            return result.rowsAffected;
            
        });
        pool.close;
       sql.close;
    }
    sql.on('error', err => {
        // ... error handler
       });
async function insertDocument(msg_id,msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,fileName,UriFile,docName,msgCaption) {
    var pool = await sql.connect(config);
    var request = await pool.request()
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
        request.input('caption',msgCaption);
        var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri,file_name,caption) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri,@docName,@caption)"						
		request.query(sqlInsert,function (err, result) {
            console.log("insert to database oki,:",result.rowsAffected);
            return result.rowsAffected;
        });
        pool.close;
       sql.close;
    }
    sql.on('error', err => {
        // ... error handler
       });   
       
async function InsertDatabase(msg_id,msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,fileName,UriFile,docName,msgCaption, latitude, longitude) {
        var pool = await sql.connect(config);
        var request = await pool.request()
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
            request.input('latitude',latitude);
            request.input(' longitude', longitude);
            request.input('docName',docName);
            request.input('caption',msgCaption);
            var sqlInsert = "INSERT INTO Telegram_log(msg_id,Msg_date,From_Id,From_name,chat_id,chat_name,chat_title,chat_type,msg_text,doc_filename,info_uri,file_name,caption,latitude,longitude) VALUES(@msg_id,@Msg_date,@From_Id,@From_name,@chat_id,@chat_name,@chat_title,@chat_type,@msg_text,@doc_filename,@info_uri,@docName,@caption,@latitude,@longitude)"						
            request.query(sqlInsert,function (err, result) {
                console.log("insert to database oki,:",result.rowsAffected);
                return result.rowsAffected;
            });
            pool.close;
           sql.close;
        }
        sql.on('error', err => {
            // ... error handler
           });   
    async function upDateTelegram(msg_id,From_Id,fileName,docName,msgCaption,latitude,longitude) {
            var pool = await sql.connect(config);
            var request = await pool.request()
                request.input('msg_id',msg_id);
                request.input('From_Id',From_Id);
                request.input('doc_filename',fileName);
                request.input('file_name',docName);
                request.input('latitude',latitude);
                request.input('longitude',longitude);
                request.input('caption',msgCaption);

                var sqlInsert = "UPDATE Telegram_log set doc_filename=@doc_filename,file_name=@file_name,caption=@caption,latitude=@latitude,longitude=@longitude WHERE msg_id=@msg_id AND From_Id=@From_Id"						
                await request.query(sqlInsert,function (err, result) {
                    console.log("update to database oki,:",result.rowsAffected + " from: " + From_Id );
                    return result.rowsAffected;
                });
                pool.close;
               sql.close;
            }
            sql.on('error', err => {
                // ... error handler
               }); 

require('log-timestamp');
console.log("End");
module.exports = {upDateTelegram};