const materialControllers = require('../controlers/materialControllers');
const { checkUser, verifyTokenAndisAdmin } = require('../muddelware/autorisations');
const multerConfig = require('../muddelware/multer-config');
const multerUpdate = require('../muddelware/multer-update');



let router = require('express').Router()

router.post('/materials', materialControllers.createMaterial );
router.get('/allmaterials', materialControllers.allmaterials);
router.get('/getmaterial/:id', materialControllers.getmaterial);
router.patch('/material/:id',verifyTokenAndisAdmin, materialControllers.updatematerial);
router.delete('/material/:id',verifyTokenAndisAdmin, materialControllers.deletematerial);
router.get('/image/:id',checkUser, materialControllers.getImages);
router.post('/materials/image',checkUser, multerConfig, materialControllers.createImage);
router.put('/materials/image/:id/:image',checkUser, materialControllers.DlelefileImage, multerUpdate, materialControllers.updateImage);
router.delete('/materials/image/delet/:id/:image', checkUser,materialControllers.DeleteImage);

router.post('/likers/:id',checkUser,checkUser, materialControllers.like);
router.get('/likers/:id',checkUser,checkUser, materialControllers.getlikers);



module.exports=router