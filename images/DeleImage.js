const path = require("path");
const fs = require("fs");

module.exports.DeleImage=(image)=>{
    const imagePath = path.join(__dirname, '/articles'); 
    const imageToDeletePath = path.join(imagePath, image);
    if (fs.existsSync(imageToDeletePath)) {
      fs.unlinkSync(imageToDeletePath);
    } 
}