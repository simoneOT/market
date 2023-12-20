/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("materials",(table)=>{
        table.increments("material_id").primary();
        table.integer('user_id').unsigned();
        table.foreign('user_id')
            .references("users.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.integer('categorie_id').unsigned();
        table.foreign('categorie_id')
            .references("categories.id")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.string("name", 100);
        table.text("description").nullable();
        table.string("isSolder",10).defaultTo(false).notNullable();
        table.float("price1").notNullable().defaultTo(0.0);
        table.float("price2").notNullable().defaultTo(0.0);
        table.float("price3").notNullable().defaultTo(0.0);
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("materials");
};
