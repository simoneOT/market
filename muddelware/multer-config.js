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
        collback(null, "images/articles")
    },
    filename:(req, file, collback)=>{
        const externsion  =MYMTYPE[file.mimetype]
        const name =  Date.now()+"."+""+externsion
        req.file=req.files
        collback(null, name)
    }
})
module.exports=multer({storage:stockage, limits:{fieldSize:maxSize}, fileFilter: imageFilter}).array('images', 6)