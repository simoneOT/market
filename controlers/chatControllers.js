const knexDB = require("../config/knexj");
const http = require('http');
const socketio = require("socket.io")(http,{
    cors:{
        origin:"http://10.0.2.2:300"
    }
})
socketio.on("connection", (socketio)=>{
    console.log("hghuinuj")
})

module.exports.chatConversation =(req, res)=>{
   
}