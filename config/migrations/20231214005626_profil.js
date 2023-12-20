/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("profil", (table)=>{
      table.increments("id").unique().unsigned().primary()
      table.string("profil", 100).nullable().unique()
      table.integer("userId").notNullable().unique()
      table.timestamps(true, true);
    })
  };
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
      knex.schema.dropTable("profil")
    
  };
