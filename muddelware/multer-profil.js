const multer = require("multer");
const { imageFilter } = require("./Erorors");
const maxSize = 1000000

const MYMTYPE={
    "image/jpeg":"jpg",
    "image/jpg":"jpg",
    "image/png":"jpg"
}

const stockage=multer.diskStorage({
    destination:(req, file, collback)=>{
        collback(null, "images/profils")
    },
    filename:(req, file, collback)=>{
        const externsion  =MYMTYPE[file.mimetype]
        const name =  req.params.id+"."+""+externsion
        req.file=req.file
        collback(null, name)
    }
})
module.exports=multer({storage:stockage, limits:{fieldSize:maxSize}, fileFilter: imageFilter}).single('profil')