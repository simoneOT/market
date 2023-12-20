
module.exports.generateValidationCode = (length)=>{
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset.charAt(randomIndex);
      }
      return code;
}
module.exports.generateValidationCodeMessage = (length)=>{
    const charset = "0123456789"; 
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset.charAt(randomIndex);
      }
      return code;

}
module.exports.constante ={
    round:10,
    condeLength:6,
    condeFor:4
}
