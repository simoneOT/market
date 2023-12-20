const emailValidator = require("email-validator")
const knexDB = require("../config/knexj")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { SignUpErrors } = require("../utils/error.utils");
const { constante, generateValidationCode, generateValidationCodeMessage } = require("../utils/validationCode");


const Maxage = 3 * 24 * 60 * 60 * 1000
function createToken(user) {
    return jwt.sign({id:user.id, email:user.email, username:user.username, phone:user.phone, role:user.role}, process.env.TOKEN_SECRETE,
        { expiresIn: Maxage })
}

module.exports.signUp = (req, res) => {
    const { username, email, password, phone, role, idAppareil, typeAppareil } = req.body

    const mailTo = emailValidator.validate(email)
    const salt = bcrypt.genSaltSync(constante.round);
    const hash = bcrypt.hashSync(password, salt);
    const code = generateValidationCode(constante.condeLength)
    const codeMessage = generateValidationCodeMessage(constante.condeFor)
    if (mailTo) {
        knexDB.select("email", "phone").from('users').where({ email: email })
            .then((response) => {
                if (response.length) {
                    res.status(401).json({ message: "Cet mail est déja prit !" })
                } else {
                    knexDB('users').insert({ username, email, password: hash, isValid: false,phone, role, profile: "", code, codeMessage,
                        idAppareil, typeAppareil: typeAppareil ? typeAppareil : "MOBILE"
                    })
                        .then(function (user) {
                            return knexDB('users')
                                .select("id","codeMessage", "email", "phone")
                                .where("id", user[0])
                                .then((data) => {
                                    res.status(200).json(data[0])
                                })
                                .catch((error) => {
                                    const errors = SignUpErrors(error)
                                    res.status(404).send(errors )
                                });
                        })
                        .catch((error)=>{
 
                            const errors = SignUpErrors(error?.sqlMessage)
                            if (errors) {
                                res.status(404).send({message:errors})
                            } else {
                                res.status(500).send(error)
                            }
                        })
                       
                }
            })
            .catch((error) => {
                res.status(500).json(error)
            })
    } else {
        res.status(401).json({ message: "Mail incorrect!" })
    }
}
module.exports.regenerativeCode=(req, res)=>{
    const codeMessage = generateValidationCodeMessage(constante.condeFor)
    const  userId  =parseInt(req.params.id) 
    knexDB('users')
        .where("id", userId)
        .update({ codeMessage: codeMessage })
        .then((user)=>{
            if (user) {
                knexDB('users')
                .select("id","phone", "codeMessage")
                .where("id", userId)
                .then((resp)=>{
                    res.status(200).json(resp[0])
                })
                .catch((error)=>{
                    res.status(500).json(error)
                })
            } else {
                res.status(404).json({message:"Veillez reprendre"})  
            }
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}

//============================================== Validation de compte ==================================================================================
module.exports.validateUser = (req, res) => {
    const { codeMessage, id } = req.body
    knexDB('users')
        .select("*")
        .where("id", id)
        .then((user) => {
            if (user[0].codeMessage === codeMessage) {
                knexDB('users')
                    .where('id', user[0].id)
                    .update({ isValid: true })
                    .then((response) => {
                        if (response) {
                            const token = createToken({email:user[0].email, id:user[0].id,  phone:user[0].phone})
                            res.cookie('jwt', JSON.stringify(token), { maxAge: Maxage, httpOnly: true })
                            res.status(200).json({tokenExpire:Maxage, token:token })
                        } else {
                            res.status(401).json({ message: "Compte nom validé veillez reessayé" })
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error })
                    })
            } else {
                res.status(401).json({ message: "Code invalide" })
            }
        })
        .catch((err) => {
            res.status(500).json({ err })
        })


}
module.exports.signIn = (req, res) => {
    const { login, password } = req.body
    knexDB('users').select("username", "isValid", "phone", "role", "profile")
        .then(() => {
            return knexDB('users')
                .select('*')
                .where(function () {
                    this.where('email', login).orWhere('phone', login);
                })
                .first();
        })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then((response) => {
                        if (response) {
                            const token = createToken({name:user.username, email:user.email, id:user.id,  phone:user.phone})
                            res.cookie('jwt', JSON.stringify(token), { maxAge: Maxage, httpOnly: true })
                            res.status(200).json({tokenExpire:Maxage,username:user.username, token:token })
                        } else {
                            res.status(401).json({ message: "Mot de passe ou nom d’utilisateur incorrect" })
                        }
                    })
                    .catch((err) => {
                        res.status(401).json({ err })
                    })
            } else {
                res.status(401).json({ message: "Mot de passe ou nom d’utilisateur incorrect" })
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error })
        });

}
module.exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
}

//mot de passe oublier

//============================================== Evoye de message ==================================================================================
module.exports.reset = (req, res) => {
    const { coordinate } = req.body
    knexDB('users').select("*")
        .then(() => {
            return knexDB('users')
                .select("id", "codeMessage")
                .where(function () {
                    this.where('email', coordinate).orWhere('phone', coordinate);
                })
                .first();
        })
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}
module.exports.checkcode = (req, res) => {
    const { id, codeMessage } = req.body
    knexDB('users').select("*")
        .where('id', id)
        .then(() => {
            return knexDB('users')
                .select("*")
                .first();
        })
        .then((user) => {
            if (user.codeMessage === codeMessage) {
                res.status(200).json({ infoUser: { isValideCode: true, id: user.id } })
            } else {
                res.status(200).json({ infoUser: { isValideCode: false } })
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}

//============================================== Update Passzord ==================================================================================
module.exports.forgotPassword = (req, res) => {
    const id = req.params.id
    const { password } = req.body
    const salt = bcrypt.genSaltSync(constante.round);
    const hash = bcrypt.hashSync(password, salt);
    if (id) {
        knexDB('users').select("*")
            .where("id", id)
            .then(() => {
                return knexDB('users')
                    .select("*")
                    .first();
            })
            .then((user) => {
                if (user) {
                    knexDB('users')
                        .where('id', user.id)
                        .update({ password: hash })
                        .then((response) => {
                            if (response !== 0) {
                                res.status(200).json({ message: "Mot de passe mise à jour avec succès" })
                            } else {
                                res.status(401).json({ message: "erreur de mise à jour de mot de passe veillez reessayé" })
                            }
                        })
                        .catch((error) => {
                            res.status(500).json({ error })
                        })
                } else {
                    res.status(401).json({ message: "mot de passe nom modifier vellez ressayé" })
                }
            })
    }

}
//mot de passe oublier

//============================================== Action user ==================================================================================
module.exports.getAllUser=(req, res)=>{
    knexDB("users")
    .select("id", "username","isValid","email", "phone", "role", "profile", " created_at"," updated_at")
    .orderBy("username", "asc")
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(200).json(error)
        })
}
module.exports.getUser=(req, res)=>{
    const id  = req.params.id
    knexDB("users")
        .select("id", "username","isValid", "phone", "role","email", "profile", " created_at"," updated_at")
        .where("id", id)
        .then((response)=>{
            knexDB("profil")
                .select("id", "profil","created_at", "updated_at")
                .where("userId",response[0].id)
                .then((respo)=>{
                    res.status(200).json({user:response[0],profil:respo[0]})
                })
                .catch((error)=>{
                    res.status(200).json(error)
                })
        })
        .catch((error)=>{
            res.status(200).json(error)
        })
}
module.exports.deleteUser=(req, res)=>{
    const id  = req.params.id
    knexDB("users")
        .where("id", id)
        .del()
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(200).json(error)
        })
}
module.exports.updadteUser=(req, res)=>{
    const id  = req.params.id
    console.log( )
    if (req.ConnectUser.id===parseInt(id) || req.ConnectUser.role==="SUPER_ADMIN") {
    const{username,email, phone, profile}=req.body
    knexDB("users")
        .select("id","username","email", "phone", "profile")    
        .where("id", id)
        .then((response)=>{
            if (response[0].username!==username || response[0].email==!email|| response[0].phone==!phone) {
            knexDB("users")
            .where('id', response[0].id)
            .update({ 
                username: username?username:response[0].username,
                email: email?email:response[0].email, 
                phone: phone?phone:response[0].phone})
                .then((resp)=>{
                    if (resp) {
                        res.status(200).json({message:"mise à jour du compte réussi."})
                    } else {
                        res.status(401).json({message:"erreur de mise à jour du compte veillez ressayé."})
                    }
                })
                .catch((error)=>{
                    res.status(500).json(error)

                })
            } else {
                res.status(401).json({message:"veillez mettre à jour vos information."})
            }
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
    } else {
        res.status(401).json({message:"Vous n‘avez pas l‘qutorisqtion"})
    }
}
//profil
module.exports.createProfil=(req, res)=>{
    const userId = parseInt(req.params.id)
    const profil = req.file.filename
        knexDB('profil')
        .select("*")
        .where("userId", userId)
        .then((prof)=>{
           if (prof[0]?.profil===profil) {
                knexDB('profil')
                .select("*")
                .where("userId", prof[0].userId)
                .then((prof)=>{
                    res.status(200).json(prof[0])
                })
                .catch((error)=>{
                    res.status(500).json({ error })
                })
           } else {
                knexDB('profil')
                .insert({profil:profil, userId:userId})
                .then(function (response) {
                    knexDB('profil')
                        .select("*")
                        .where("id", response[0])
                        .then((prof)=>{
                            res.status(200).json(prof[0])
                        })
                        .catch((error)=>{
                            res.status(500).json({ error })
                        })
                })
                .catch((error) => {
                    res.status(500).json({ error })
                });
            }
        })
        .catch((error)=>{
            console.log(error)
            res.status(500).json({ error })
        })


      
}
module.exports.getProfil=(req, res)=>{
    const userId = req.params.id
    knexDB('profil')
        .select("*")
        .where("userId", parseInt(userId))
        .then((profil)=>{
            res.status(200).json(profil[0])
        })
        .catch((error)=>{
            res.status(500).json(error)
        })
}
