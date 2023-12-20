/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("cards", (table) => {
            table.increments('id').primary();
            table.integer('material_id').unsigned()
            table.integer('user_id').unsigned()
            table.foreign('material_id')
                .references("materials.material_id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.foreign('user_id')
                .references("users.id")
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.integer('nombre').notNullable();
            table.integer('total').notNullable();
            table.boolean('isSolder').defaultTo(false);
            table.string('product_name', 50).notNullable();
            table.timestamps(true, true);
        })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("user")
};