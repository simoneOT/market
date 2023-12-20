/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("images",(table)=>{
      table.increments("id").unsigned().primary().unique()
      table.string('image1',100).notNullable();
      table.string('image2',100).notNullable();
      table.string('image3',100).notNullable();
      table.string('image4',100).notNullable();
      table.string('image5',100).nullable();
      table.string('image6',100).nullable();
      table.integer('material_id').unsigned().notNullable();
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
      knex.schema.dropTable("images")
  };
  
