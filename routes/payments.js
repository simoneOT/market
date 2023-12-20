const router = require('express').Router()
const paymentsControllers = require("../controlers/payments")
// const  muddelware=require("../muddelware")
router.post("/payment/calback",paymentsControllers.calback)
router.post("/payment/:user_ID",paymentsControllers.GET_ID_COMMANDE, paymentsControllers.GetUrl_VitePay )

module.exports=router