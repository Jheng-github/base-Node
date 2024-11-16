const knex = require("knex")(require("./dev.config.js")["knexConfig"]);

module.exports = knex;
