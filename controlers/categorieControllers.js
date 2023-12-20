const knexDB = require("../config/knexj");
const { isEmty } = require("../utils/error.utils");

module.exports.createCategorie=(req, res)=>{
    const{name}=req.body
    knexDB('categories')
        .select("*")
        .orderBy("name", "asc")
        .then((response)=>{
            if (response[0]?.name===name) {
                res.status(403).json({message:"la Categorie existe!"})
            } else {
                knexDB('categories').insert({ name})
                    .then(function (material) {
                        if (material[0]) {
                            res.status(200).json({message:"Categories créer avec succès"})
                        } else {
                            res.status(403).json({message:"Categories n‘as pas été créer  veillez ressayé"})
                        }
                    })
                    .catch((error) => {
                        const errors = MaterialErros(error)
                        res.status(500).json({ errors })
                    });
                        }
                    })
        .catch((error)=>{
            res.status(500).json(error)
        })


}
module.exports.allCategories=(req, res)=>{
    knexDB('categories')
        .select("*")
        .orderBy("name", "asc")
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.getCategorie=(req, res)=>{
    const id = req.params.id
    knexDB('categories')
        .select("*")
        .where("id", id)
        .orderBy("name", "asc")
        .then((response)=>{
            res.status(200).json(response[0])
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.updatCategorie=(req, res)=>{
    const id = req.params.id
    const{name}=req.body
    knexDB('categories')
    .select("*")
        .where("id", parseInt(id) )
        .orderBy("name", "asc")
        .then((response)=>{
                if (isEmty(name)) {
                    res.status(403).json({message:"Veillez renseigné tous les champs!"})
                } else {
                    if (name!==response[0].name ) {
                        knexDB("categories")
                            .where('id', response[0].id)
                            .update({ name})
                                .then((resp)=>{
                                    if (resp) {
                                        res.status(200).json({message:"Mise à jour de la catégorie réussi avec succès!"})
                                    } else {
                                        res.status(401).json({message:"Erreur de mise à jour  veillez ressayé!"})
                                    }
                                })
                                .catch((error)=>{
                                    res.status(500).json(error)
                                })
                    } else {
                        res.status(403).json({message:"Veillez apporté un changement sur la catégorie!"})
                    }
                }
        })
        .catch((error)=>{
            res.status(500).json(error)
        })

}
module.exports.deleteategorie= (req, res)=>{
    const id = req.params.id
    knexDB('materials')
        .select("*")
        .then((response)=>{
            if (response[0]) {
                res.status(403).json({message:"Veillez supprmé dabord les articles qui contient ce catégorie!"})
            } else {
                knexDB('categories')
                    .del()
                    .then((response)=>{
                        res.status(200).json({message:"Catégorie supprimé avec succès!"})
                    })
                    .catch((error)=>{
                        res.status(200).json(error)
                    })
            }
        })
        .catch((error)=>{
            res.status(500).json(error)
        })

      
}