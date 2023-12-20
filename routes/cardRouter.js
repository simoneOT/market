
let router = require('express').Router()
const cardControllers = require('../controlers/cardControllers');
const { verifyTokenAndisAdmin, checkUser } = require('../muddelware/autorisations');

router.post('/',checkUser, cardControllers.createCard);
router.patch('/:id',checkUser, cardControllers.updatcard);
router.get('/',checkUser, cardControllers.allcard);
router.get('/:id',checkUser, cardControllers.getcard);
router.delete('/:id',checkUser, cardControllers.deletecard);
module.exports=router