let router = require('express').Router()
const userControllers = require("../controlers/userControllers");
const { checkUser, verifyTokenAndAh } = require('../muddelware/autorisations');
const multerConfig = require('../muddelware/multer-profil');

router.post('/register', userControllers.signUp);
router.post('/validateCompte', userControllers.validateUser);
router.post('/login', userControllers.signIn);
router.get('/logout', userControllers.logout);
router.put('/regeneratecode/:id', userControllers.regenerativeCode);


//forgotePassword
router.post('/reset', userControllers.reset);
router.post('/checkcode', userControllers.checkcode)
router.put('/forgotPassword/:id', userControllers.forgotPassword);

// actiom user
router.get('/getAllUser',checkUser, userControllers.getAllUser);
router.get('/getUser/:id',checkUser, userControllers.getUser);
router.put('/updadteUser/:id',checkUser,verifyTokenAndAh, userControllers.updadteUser);

//profil
router.post('/profil/:id',checkUser,verifyTokenAndAh,  multerConfig, userControllers.createProfil);
router.get('/profil/:id', checkUser, verifyTokenAndAh, multerConfig, userControllers.getProfil);

module.exports=router