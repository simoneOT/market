module.exports.errorMultaire=(error, req, res, next) => {
    // verify if image size is correct
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).send({ error: "Désolé, veuillez choisir une image de maximum 1Mo !" });
    } else if (error.code==="LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({error: "Désolé, veuillez choisir au moins 4 images"});
    }  else if (error.code==="ER_DATA_TOO_LONG") {
      res.status(400).json({error: "Désolé, type de fichier non autorisé"});
    }else {
      console.log(error)
      res.status(400).json({ error: error.message });
    }
  }
  module.exports.imageFilter = (req, file, cb)=> {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Seules les images sont autorisées'), false);
    }
    cb(null, true);
  };
  