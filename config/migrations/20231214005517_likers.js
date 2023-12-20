/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("likers", (table)=>{
      table.increments("id").unsigned().unique().primary()
      table.integer('user_id').unsigned().notNullable();
      table.integer('material_id').unsigned().notNullable();
      table.timestamps(true, true);
  })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
      knex.schema.dropTable("likers")
  };
