/* La configuration de base de votre moyen de paiement*/
const url ="https://webhook.site/ed43ca84-b49c-412f-a25e-ebfa156ffca2/"
const params_vitepay = {

	/* Your callback url example: http://Vitepay.com/callback.php */
	// const WEBSITE_URL = 'https://jigiasso.com/vitepay/callback.php';// 	https://webhook.site/fcf78f37-0a56-49ae-b931-0c5346b60476
     RETURN_URL : `${url}succes`,
	 DECLINE_URL:`${url}decline`,
	 CANCEL_URL:`${url}cancell`,
	 CALLBACK_URL:`https://webhook.site/ed43ca84-b49c-412f-a25e-ebfa156ffca2/`,
	/* Your website description */
	 WEBSITE_DESCRIPTION : 'Achat chez market',
	/* Put local */
	 DEFAULT_LOCAL : 'fr', 

	/* Put currency */
	 DEFAULT_CURRENCY : 'XOF',
	
	/* Put country */
	 DEFAULT_COUNTRY : 'ML',

	/* Put payment type */
	 PAYMENT_TYPE : 'orange_money',

	/* Vitepay api version */
	 API_VERSION : '1',

	/* Vitepay key */
	 API_KEY : 'MPHQNGovAqKAvg',

	/* Vitepay secret key */
	 API_SECRET_KEY : '021095138cdf8706ba3c46f65423b4eb',

	/* ENV : sandbox on test mode otherwise ENV : prod on production mode */
	 ENV : 'sandbox',

}
module.exports=params_vitepay