const knexDB = require("../config/knexj");
const {  isEmty } = require("../utils/error.utils");
const { DeleImage } = require("../images/DeleImage");


module.exports.createMaterial=(req, res)=>{
    const{name, description, userId, categorieId, price1,price2,price3}=req.body
    console.log(name, description, userId, categorieId, price1,price2,price3)
    knexDB('materials').insert({ name, description, user_id:userId, categorie_id:categorieId, price1, price2, price3 })
        .then(function (material) {
            if (material[0]) {
                knexDB('materials')
                    .select("*")
                    .orderBy("name", "asc")
                    .then((materials)=>{
                        res.status(200).json(materials)
                    })
                    .catch((error)=>{
                        res.status(500).json(error)
                    })
            } else {
                res.status(401).json({message:"Article n‘as pas été créer  veillez ressayé"})
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error })
        });

}
module.exports.allmaterials=(req, res)=>{
    knexDB('materials')
        .select("*")
        .orderBy("name", "asc")
        .then((materials)=>{
            res.status(200).json(materials)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.getmaterial=(req, res)=>{
    const id = req.params.id
    knexDB('materials')
        .select("*")
        .where("material_id", id)
        .orderBy("name", "asc")
        .then((response)=>{
            knexDB('categories')
                .select("*")
                .where("id", response[0].categorie_id)
                .then((categorie)=>{
                    knexDB('users')
                        .select("username", "isValid", "phone", "role", "profile")
                        .where("id", response[0].user_id)
                        .then((user)=>{
                            res.status(200).json({material:response[0],categorie:categorie[0], user:user[0] })
                        })
                        .catch((error)=>{
                            res.status(500).json(error)
                        })
                })
                .catch((error)=>{
                    res.status(500).json(error)
                })
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.updatematerial=(req, res)=>{
    const id = req.params.id
    const{name, description, price1, price2, price3}=req.body
    knexDB('materials')
    .select("*")
        .where("material_id", id)
        .orderBy("name", "asc")
        .then((response)=>{
            if (req.ConnectUser.id===response[0].user_id || req.ConnectUser.role==="SUPER_ADMIN") {
                if (isEmty(name) || isEmty(description)  || isEmty(price1) || isEmty(price2) || isEmty(price3)) {
                    res.status(403).json({message:"Veillez renseigné tous les champs!"})
                } else {
                    if (name!==response[0].name || description!==response[0].description || parseInt(price1)!==response[0].price1||parseInt(price2)!==response[0].price2 ||parseInt(price3)!==response[0].price3) {
                        knexDB("materials")
                            .where('material_id', response[0].material_id)
                            .update({ name,description, price1, price2, price3})
                                .then((resp)=>{
                                    if (resp) {
                                        res.status(200).json({message:"mise à jour de l‘article réussi avec succès!"})
                                    } else {
                                        res.status(401).json({message:"Erreur de mise à jour du compte veillez ressayé!"})
                                    }
                                })
                                .catch((error)=>{
                                    res.status(500).json(error)
                                })
                    } else {
                        res.status(401).json({message:"Veillez apporté un changement sur au moins un champ!"})
                    }
                }
                     
            } else {
                res.status(403).json({message:"Vous n‘avez pas l‘autorisation"})
            }
        })
        .catch((error)=>{
            res.status(500).json(error)
        })

}
module.exports.deletematerial= (req, res)=>{
    const id = req.params.id
    if (id) {
        knexDB('materials')
        .select("user_id")
        .then((user)=>{
            if (req.ConnectUser.id===user[0].user_id || req.ConnectUser.role==="SUPER_ADMIN") {
                knexDB('materials')
                .del()
                .where("material_id", id)
                .then((response)=>{
                    
                    if (response) {
                        res.status(200).json({message:"Article supprimé avec succès!"})
                    } else {
                        res.status(401).json({message:"Article n‘existe pas "})
                    }
                })
                .catch((error)=>{
                    res.status(500).json(error)
                })
            } else {
                res.status(403).json({message:"Vous n‘avez pas le l‘autorisation"})
            }
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
        
        

    }else{
        res.status(401).json({message:"Veillez selectionné un article pour supprimé!"})

    }
}
module.exports.like=(req, res)=>{
    const id = req.params.id
    const { materialId }=req.body
    knexDB('likers')
        .select("*")
        .where("material_id", parseInt(materialId))
        .andWhere("user_id", parseInt(id))
        .then((likers)=>{
            if (likers[0]) {
                knexDB('likers')
                    .del()
                    .then((response)=>{
                        res.status(200).json({message:"unLiker"})
                    })
                    .catch((error)=>{
                        res.status(500).json(error)
                    })
            } else {
                knexDB('likers').insert({user_id:parseInt(id), material_id: parseInt(materialId)})
                .then(function (likers) {
                    if (likers[0]) {
                        res.status(200).json({message:"liker"})
                    } else {
                        res.status(403).json({message:"Erreur unLiker"})
                    }
                })
                .catch((error) => {
                    res.status(500).json(error)
                });
            }
        })
        .catch((error)=>{
            res.status(500).json(error)

        })

}
module.exports.getlikers=(req, res)=>{
    const id = req.params.id
    knexDB('likers')
        .select("*")
        .where("material_id", parseInt(id))
        .then((likers)=>{
            res.status(200).json({number:likers.length})
        })
        .catch((error)=>{
            res.status(500).json(error)
        })

}
module.exports.createImage=(req, res)=>{
    const id = req.params.id
    const images = req.file
    const allImage = {
        image1:`image1_${images[0].filename}`,
        image2:`image2_${images[1].filename}`,
        image3:`image3_${images[2].filename}`,
        image4:`image4_${images[3].filename}`,
        image5:images[4]?.filename?`image5_${images[4]?.filename}`:"",
        image6:images[5]?.filename?`image6_${images[5]?.filename}`:"",
    }
    if (!images.length<=3) {
        if (allImage.image1 && allImage.image2 && allImage.image3&& allImage.image4) {
            knexDB('images').insert({material_id:parseInt(id), image1:allImage.image1, image2:allImage.image2, image3:allImage.image3, image4:allImage.image4, 
                image5:allImage.image5?allImage.image5:"", image6 :allImage.image6?allImage.image6:""})
            .then(function (material) {
                knexDB('images')
                .select("*")
                .where("id", material[0])
                .then((image)=>{
                    res.status(200).json(image[0])
                })
                .catch((error)=>{
                    res.status(500).json({ error })
                })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ error })
            });
        }
       
    } else {
        res.status(403).json({message:"veillez choisir au moins 4 images" })
        
    }
    
}
module.exports.getImages=(req, res)=>{
    const id = req.params.id
    knexDB('images')
        .select("*")
        .where("material_id", parseInt(id))
        .then((likers)=>{
            res.status(200).json(likers[0])
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.DlelefileImage=(req, res, next)=>{
    const image= req.params.image
    const imageNameToDelete =  image.split("_")[1]
    DeleImage(imageNameToDelete)
    next()
}
module.exports.updateImage=(req, res)=>{
    const id = req.params.id
    const imagecheck= req.file.filename
    const image= req.params.image.split("_")[0]
    knexDB('images')
        .update(`${image}`, image+"_"+imagecheck)
        .where("material_id", parseInt(id))
        .then((image)=>{
            knexDB('images')
            .select("*")
            .where("material_id", parseInt(id))
            .then((images)=>{
                res.status(200).json(images[0])
            })
            .catch((error)=>{
                res.status(500).json(error)
            })
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.DeleteImage=(req, res)=>{
    const id = req.params.id
    const image= req.params.image?.split("_")[0]==="image5"?"image1":"image6"
    knexDB('images')
        .update(image, "")
        .where("material_id", parseInt(id))
        .then((image)=>{
            knexDB('images')
            .select("*")
            .where("material_id", parseInt(id))
            .then((images)=>{
                res.status(200).json(images[0])
            })
            .catch((error)=>{
                res.status(500).json(error)
            })
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}


