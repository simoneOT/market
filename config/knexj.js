const knexfile = require("../knexfile");
const config = knexfile.development
const knexDB =require("knex")(config)
module.exports= knexDB