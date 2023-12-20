module.exports.SignUpErrors = (err) => {
    let erros = { username: "", email: "", password: "", isValid: "", phone: "", role: "", profile: "" }
    console.log(err)
    if (err.includes('username'))
        return erros.username = 'username invalide et doit etre au maximum 50 caractère'
    else if (err.includes('email'))
        return erros.email = " votre email n'est pas valide "
    else if (err.includes('password'))
        return erros.password = "password incorrect et il dois etre superieur à 6"
    else if (err.includes('isValid'))
        return erros.isValid = 'isValid invalide'
    else if (err.includes('phone'))
        return erros.phone = "le numéro de téléphone est déjà prit"
    else if (err.includes('role'))
        return erros.role = 'password invalide et doit etre 20 caractère'
    else if (err.includes('profile'))
        return erros.profile = 'cet profile invalide'
    else if (err.includes('code'))
        return erros.code = 'code invalide'
    else if (err.includes('codeMessage'))
        return erros.codeMessage = 'codeMessage invalide'
    else if (err.includes('idAppareil'))
        return erros.idAppareil = 'idAppareil invalide'
    else if (err.includes('typeAppareil'))
        return erros.typeAppareil = 'typeAppareil invalide'
}
module.exports.MaterialErros=(err)=>{
    let erros = {name:"",description:"",price1:"",price2:"",price3:""}
    if (err.name.includes('name'))
        return erros.username = 'nom invalide et doit etre au maximum 100 caractère'
    if (err.message.includes('description'))
        return erros.description = " description invalide"
    if (err.message.includes('price1'))
        return erros.price1 = "price1 invalide et ne doit pas etre null"
    if (err.message.includes('price2'))
        return erros.price2 = "price2 invalide et ne doit pas etre null"
    if (err.message.includes('price3'))
        return erros.price3 = "price3 invalide et ne doit pas etre null"
}
module.exports.isEmty= (atribut)=>{
    if(atribut==="" || atribut===undefined || atribut===null){
        return true
    }
}

