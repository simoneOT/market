const jwt = require('jsonwebtoken');

const checkUser = (req, res, next)=> {
    const authHendler= req.headers.authorization 
    if (authHendler) {
        const token =  authHendler.split(" ")[1]
        jwt.verify(token, process.env.TOKEN_SECRETE, (err, ConnectUser)=>{
            if (err) res.status(403).json({message:"token n'est pas valide"})
            req.ConnectUser = ConnectUser
            next();
        }) 
    } else {
        return res.status(401).json({message:"Vous n'etes pas connecté"}) 
    }
  

}
  
const verifyTokenAndAh=  (req, res, next)=>{
    checkUser(req, res, ()=>{
        if (req.ConnectUser.id===parseInt(req.params.id) || req.ConnectUser.role=== "SUPER_ADMIN") {
            req.ConnectUser= req.ConnectUser
            next()
        } else {
            res.status(403).json({message:"Vous n‘avez pas l‘autorisation"}) 
        }
    })
}
const verifyTokenAndisAdmin=  (req, res, next)=>{
    checkUser(req, res, ()=>{
        if (req.ConnectUser.role==="SUPER_ADMIN"|| req.ConnectUser.role==="CUSTOMER") {
            req.ConnectUser= req.ConnectUser
            next()
        } else {
            res.status(403).json({message:"Vous n‘avez pas l‘autorisation"}) 
        }
    })
}
module.exports = {checkUser, verifyTokenAndAh, verifyTokenAndisAdmin}