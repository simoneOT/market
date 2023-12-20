const axios = require("axios");
const params_vitepay = require("../config/config.vitpay");
const SHA1 = require("js-sha1");
const knexDB = require("../config/knexj");
const { default: knex } = require("knex");

const GET_ID_COMMANDE = (req, res, next) => {
    const user_id = parseInt(req.params.user_ID)
    knexDB('cards')
        .select("*")
        .orderBy("created_at", "asc")
        .then((response) => {
            const ids = response.map((card) => { return `${card.id}:${card.nombre}` });
            const concatenatedIds = ids.join('|')
            const total = response.reduce((accumulator, card) => accumulator + card.total, 0);
            if (concatenatedIds && total) {
                knexDB('commandes')
                    .insert({ user_id, id_Prdts: concatenatedIds, totality: total })
                    .then((commande) => {
                        if (commande[0]) {
                            req.order_id = commande[0]
                            req.user_id = user_id
                            req.amount = total
                            next()
                        }
                    })
                    .catch((error) => {
                        res.status(500).json(error)
                    })
            } else {
                res.status(404).json({ message: "Veillez reprendre l'action" })
            }
        })
        .catch((error) => {
            res.status(500).json(error)
        })
}
const GetUrl_VitePay = (req, res) => {
    const commande = {
        order_id: req.order_id,
        user_id: req.user_id,
        amount: req.amount
    }

    if (commande.amount && commande.order_id && commande.user_id) {

        const { DEFAULT_CURRENCY, API_SECRET_KEY, API_KEY, PAYMENT_TYPE, CALLBACK_URL, DEFAULT_LOCAL, WEBSITE_DESCRIPTION, RETURN_URL, DEFAULT_COUNTRY, DECLINE_URL, CANCEL_URL } = params_vitepay
        const order_id = commande.order_id;
        const amount_100 = commande.amount * 100;
        const callback_url = CALLBACK_URL
        const currency_code = DEFAULT_CURRENCY
        const upped = `${order_id};${amount_100};${currency_code};${callback_url};${API_SECRET_KEY}`.toUpperCase()
        const hash = SHA1(upped);
        const content = {
            language_code: DEFAULT_LOCAL,
            currency_code: currency_code,
            country_code: DEFAULT_COUNTRY,
            order_id: order_id,
            description: WEBSITE_DESCRIPTION,
            amount_100: amount_100,
            return_url: RETURN_URL,
            decline_url: DECLINE_URL,
            cancel_url: CANCEL_URL,
            callback_url: callback_url,
            p_type: PAYMENT_TYPE,
            redirect: 0,
            api_key: API_KEY,
            hash: hash,
        }
        axios.post('https://api.vitepay.com/v1/sandbox/payments', content)
            .then(response => {
                res.status(200).json({ url: response.data })
            })
            .catch(error => {
                res.status(500).json(error)
            });
    } else {
        res.status(404).json({ message: "erreur de recuperation veiller reprendre s'il vous plait" })
    }
}
const calback = (req, res) => {
    const { authenticity, order_id, sandbox, failure, success } = req.body
    const { API_SECRET_KEY, DEFAULT_CURRENCY, ENV } = params_vitepay
    if (failure || success) {
        knexDB('commandes')
            .select("totality")
            .where("id", order_id)
            .then((commande) => {
                const totality = commande[0].totality
                const amount_100 = totality * 100
                if (amount_100) {
                    const upped = `${order_id};${amount_100};${DEFAULT_CURRENCY};${API_SECRET_KEY}`
                    const hash = SHA1(upped).toUpperCase();
                    if (hash === authenticity) {
                        if (success === 1) {
                            if (sandbox === 1) {
                                knexDB('commandes')
                                where("id", order_id)
                                    .updatse("status", true)
                                    .then((order) => {
                                        if (order[0]) {
                                            knexDB('cards')
                                                .del()
                                                .then((card) => {
                                                    if (card) {
                                                        res.send({ status: 1 })
                                                    } else {
                                                        res.send({ "status": "0", "message": "La mise à jour  du panier à échoué ." })
                                                    }
                                                })
                                        } else {
                                            res.send({ "status": "0", "message": "La mise à jour  à échoué." })
                                        }
                                    })
                                    .catch(() => { res.send({ "status": "0", "message": "erreur de mise à jour de la table commade." }) })
                            } else {
                                knexDB('commandes')
                                where("id", order_id)
                                    .updatse("status", true)
                                    .then((order) => {
                                        if (order[0]) {
                                            knexDB('cards')
                                                .del()
                                                .then((card) => {
                                                    if (card) {
                                                        res.send({ status: 1 })
                                                    } else {
                                                        res.send({ "status": "0", "message": "La mise à jour  du panier à échoué ." })
                                                    }
                                                })
                                        } else {
                                            res.send({ "status": "0", "message": "La mise à jour  à échoué." })
                                        }
                                    })
                                    .catch(() => { res.send({ "status": "0", "message": "erreur de mise à jour de la table commade." }) })
                            }
                        } else if (failure === 1) {
                            res.status(404).json({ "failure": "1", "message": "Le payment à échoué." })
                        }else{
                            res.status(404).json({  "message": "Le payment à échoué." })
                        }

                    } else {
                        res.status(404).json({ status: 0, our_authenticity: hash, error: "Mauvaise autenticity" })
                    }
                }
            })
            .catch((error) => {
                res.status(500).status(error)
            })
    } else {
        res.status(404).status({message:"Erreur de payment"})
    }
}

module.exports = { GetUrl_VitePay, GET_ID_COMMANDE, calback }