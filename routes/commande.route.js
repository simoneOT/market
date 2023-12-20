const router = require('express').Router()
const commandesControllers = require("../controlers/commande.controllers")


router.delete("/delete/:id",commandesControllers.deleteCommande)
router.get("/:id/:status1",commandesControllers.allCommandes)

module.exports=router