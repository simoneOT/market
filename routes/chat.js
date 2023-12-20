let router = require('express').Router()
const chatControllers = require("../controlers/chatControllers");
const { checkUser, verifyTokenAndAh } = require('../muddelware/autorisations');

router.post('/chat', chatControllers.chatConversation);