/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("commandes", (table)=>{
        table.increments("id").notNullable().primary(),
        table.integer('user_id').unsigned().references('users.id').onDelete('SET NULL').onUpdate('CASCADE');
        table.string('id_Prdts').notNullable
        table.integer("totality", 50).notNullable(),
        table.boolean("status", 10).defaultTo(false),
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("commandes")
};
