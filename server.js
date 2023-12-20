let express = require('express')
const bodyParser =require('body-parser')
const cookieParser= require('cookie-parser')
require('dotenv').config({path: './config/.env'})
let app = express()
const user = require("./routes/userRoute")
const material = require("./routes/materialRoute")
const categories = require("./routes/categorieRouter")
const payments = require("./routes/payments")
const commande = require("./routes/commande.route")
const card = require("./routes/cardRouter")
const { errorMultaire } = require('./muddelware/Erorors')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 
const { chatConversation } = require('./controlers/chatControllers')
const http = require('http').Server(app);
var cors = require('cors')
// const socketio = require("socket.io")(http,{cors:{origin:"http://10.0.2.2:3000"}})





const corsOPtion = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors(corsOPtion))

app.use("/api/v1/user",user )
app.use("/api/v1/material", material )
app.use("/api/v1/categorie", categories )
app.use("/api/v1/card", card )
app.use("/api/v1/chat", chatConversation )
app.use("/api/v1/commande", commande )
app.use("/api/v1/payments", payments )


//erro Multer
app.use(errorMultaire)

// socketio.on("connection", (socketio)=>{
//     console.log("socketio")
// })

//conexion 
http.listen(process.env.PORT || 5000, ()=>{
    console.log(`listening le port ${process.env.PORT}`);
})