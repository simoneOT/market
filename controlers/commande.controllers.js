const knexDB = require("../config/knexj")


module.exports.allCommandes=(req, res)=>{
    const userId= parseInt(req.params.id)
    const status1 =req.params.status1
    knexDB('commandes')
        .select("*")
        .orderBy("created_at", "asc")
        .where("status",0)
        .andWhere("user_id",userId)
        .andWhere("status1",status1)
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
module.exports.deleteCommande=(req, res)=>{
    const userId= parseInt(req.params.id)
    const {idCmdt, status1}= req.body
    knexDB('commandes')
        .where("id", idCmdt)
        .andWhere("user_id",userId)
        .update("status1",status1)
        .then((response)=>{
            if (response) {
                res.status(200).json({message:"succes"})
            } else {
                res.status(404).json({message:"bot success"})
            }
        })
        .catch((error)=>{
            console.log(error)
            res.status(500).json(error)
        })
}