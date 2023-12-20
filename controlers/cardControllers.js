const knexDB = require("../config/knexj");
const { isEmty } = require("../utils/error.utils");

module.exports.createCard = (req, res) => {
    const { user_id, material_id, nombre, total, product_name } = req.body
    knexDB('cards')
        .select("*")
        .where("material_id", material_id)
        .then((cart) => {
            if (cart[0]) {
                const nbr = cart[0].nombre + 1
                knexDB("cards")
                    .update({ nombre: nbr})
                    .where('material_id', material_id)
                    .andWhere("user_id", user_id)
                    .then((resp) => {
                        if (resp) {
                            res.status(200).json({ message: "Mise à jour du panier réussi avec succès!" })
                        } else {
                            res.status(401).json({ message: "Erreur de mise à jour  veillez ressayé!" })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(500).json(error)
                    })
            } else {
                knexDB('cards').insert({ user_id, material_id, nombre, total, product_name })
                    .then(function (response) {
                        if (response[0]) {
                            knexDB('cards').select("*")
                                .where("id", response[0])
                                .orderBy("created_at", "asc")
                                .then((cards) => {
                                    res.status(200).json(cards[0])
                                })
                                .catch((error) => {
                                    res.status(500).json({ error })
                                });
                        } else {
                            res.status(403).json({ message: "Le panier n‘as pas été créer  veillez ressayé" })
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    });
            }

        })


}
module.exports.allcard = (req, res) => {
    knexDB('cards')
        .select("*")
        .orderBy("created_at", "asc")
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((error) => {
            res.status(500).json(error)
        })
}
module.exports.getcard = (req, res) => {
    const id = req.params.id
    knexDB('cards')
        .select("*")
        .where("id", id)
        .andWhere("status", true)
        .orderBy("created_at", "asc")
        .then((response) => {
            res.status(200).json(response[0])
        })
        .catch((error) => {
            res.status(500).json(error)
        })
}
module.exports.updatcard = (req, res) => {
    const id = req.params.id
    const { nombre } = req.body
    knexDB('cards')
        .select("*")
        .where("id", parseInt(id))
        .orderBy("created_at", "asc")
        .then((response) => {
            if (req.ConnectUser.id === response[0].user_id) {
                if (nombre !== undefined && nombre !== null) {
                    knexDB("cards")
                      .where('id', response[0].id)
                      .update({ nombre })
                      .then((resp) => {
                        if (resp) {
                          res.status(200).json({ message: "Mise à jour du panier réussie avec succès!" })
                        } else {
                          res.status(401).json({ message: "Erreur de mise à jour, veuillez réessayer!" })
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json(error);
                      });
                  } else {
                    res.status(400).json({ message: "La valeur 'nombre' est manquante ou non définie." });
                  }

            } else {
                res.status(403).json({ message: "Vous n‘avez pas l‘autorisation" })
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })

}
module.exports.deletecard = (req, res) => {
    const id = req.params.id
    knexDB('cards')
        .select("*")
        .where("user_id", req.ConnectUser.id)
        .andWhere("id", id)
        .then((response) => {
            if (response[0]) {
                knexDB('cards')
                    .where("id", id)
                    .del()
                    .then((resp) => {
                        res.status(200).json({ message: "Panier supprimé avec succès!" })
                    })
                    .catch((error) => {
                        res.status(200).json(error)
                    })
            } else {
                res.status(403).json({ message: "Vous n‘etes pas le proprietaire du panier" })
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })


}