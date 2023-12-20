const  axios  = require("axios");
const params_vitepay= require("../config/config.vitpay");
const SHA1=require("js-sha1") 



// module.exports.GetUrl_VitePay=(req,res, next)=>{
//     // const {DEFAULT_CURRENCY, API_SECRET_KEY,API_KEY, WEBSITE_URL,PAYMENT_TYPE, DEFAULT_LOCAL, WEBSITE_DESCRIPTION, RETURN_URL, DEFAULT_COUNTRY }=params_vitepay
//     // const order_id  = req.params.order_id;
//     // const amount_100 = req.body.amount_100*100;
//     // const callback_url=WEBSITE_URL
//     // const currency_code =DEFAULT_CURRENCY
//     // const upped = `${order_id};${amount_100};${currency_code}$;${callback_url};${API_SECRET_KEY}`
//     // const hash = SHA1(upped);
//     // const conetent={
//     //     language_code:DEFAULT_LOCAL,currency_code:currency_code,country_code:DEFAULT_COUNTRY,order_id,description:WEBSITE_DESCRIPTION,amount_100:amount_100,
//     //     return_url:RETURN_URL,
//     //     decline_url:RETURN_URL,
//     //     cancel_url:RETURN_URL,
//     //     callback_url:callback_url,
//     //     p_type:PAYMENT_TYPE,
//     //     redirect:0,
//     //     api_key:API_KEY,
//     //     hash:hash,
//     //     mail:""
//     // }
//     // const config = {
//     //     headers: {
//     //       'Content-Type': 'application/x-www-form-urlencoded'
//     //     }
//     //   };
      
//     // axios.post('https://api.vitepay.com/v1/prod/payments', conetent, config)
//     // .then(response => {
//     //     console.log(response.data);
//     // })
//     // .catch(error => {
//     //     console.error('Erreur :', error);
//     // });
//     next()
// }
