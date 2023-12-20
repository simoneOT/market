/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
    return knex.schema
        .createTable("users", (table) => {
            table.increments('id').primary();
            table.string('username', 50).notNullable();
            table.string('email', 100).unique().notNullable();
            table.string('password', 100).notNullable();
            table.boolean('isValid', 20).defaultTo(false).notNullable();
            table.string('phone', 20).unique().notNullable();
            table.string('role', 20).defaultTo("customer");
            table.string('profile', 100);
            table.string('code', 6).notNullable();
            table.string('codeMessage', 6).unique().notNullable();
            table.string('idAppareil', 100).nullable();
            table.string('typeAppareil',100).defaultTo("MOBILE");
            table.timestamps(true, true);
        })
};
/**

 */
exports.down = function (knex) {
    return knex.schema.dropTable("users")
}
