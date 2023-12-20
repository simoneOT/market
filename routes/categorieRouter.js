
let router = require('express').Router()
const categorieControllers = require('../controlers/categorieControllers');
const { verifyTokenAndisAdmin, checkUser } = require('../muddelware/autorisations');

router.post('/categories',verifyTokenAndisAdmin, categorieControllers.createCategorie);
router.get('/allcategories',checkUser, categorieControllers.allCategories);
router.get('/getcategorie/:id',checkUser, categorieControllers.getCategorie);
router.patch('/:id',verifyTokenAndisAdmin, categorieControllers.updatCategorie);
router.delete('/:id',verifyTokenAndisAdmin, categorieControllers.deleteategorie);
module.exports=router