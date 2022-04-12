const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('ingredients as ing')
  .join('ingredient_types as ing_type', 'ing_type.ingredient_type_id', 'ing.ingredient_type_id')
  .orderBy('ing.ingredient_id', 'asc');

  const ingredients = rows.map(row => {
    return {
      ingredient_id: row.ingredient_id,
      name: row.ingredient_name,
      created_at: row.ingredient_created_at,
      modified_at: row.ingredient_modified_at,
      ingredient_type: {
        ingredient_type_id: row.ingredient_type_id,
        name: row.ingredient_type_name,
        created_at: row.ingredient_type_created_at,
        modified_at: row.ingredient_type_modified_at,
      }
    }
  });

  return ingredients;
}

module.exports = {
  findAll
}