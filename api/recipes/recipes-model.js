const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('recipes as rp')
  .leftJoin('cuisine_types as c_type', 'c_type.cuisine_type_id', 'rp.cuisine_type_id')
  .leftJoin('users as u', 'u.user_id', 'rp.user_id')
  .leftJoin('roles as r', 'r.role_id', 'u.role_id')
  .orderBy('rp.recipe_id', 'asc');

  

  let recipes = rows.map(async row => {
    
    const recipe_steps = await db('recipe_steps as rp_steps')
    .where({
      recipe_id: row.recipe_id
    })
    .select(
      'recipe_step_id',
      'recipe_step_text as text',
      'recipe_step_index as index',
      'recipe_id',
      'recipe_step_created_at as created_at',
      'recipe_step_modified_at as modified_at',
    );

    let recipe_ingredients = await db('recipe_ingredients as rp_ing')
    .join('ingredients as ing', 'ing.ingredient_id', 'rp_ing.ingredient_id')
    .join('ingredient_types as ing_type', 'ing_type.ingredient_type_id', 'ing.ingredient_type_id')
    .join('measurement_units as m_unit', 'm_unit.measurement_unit_id', 'rp_ing.measurement_unit_id')
    .where({
      recipe_id: row.recipe_id
    })
    .select(
      'rp_ing.recipe_ingredient_id',
      'rp_ing.recipe_ingredient_quantity',
      'rp_ing.recipe_ingredient_index',
      'rp_ing.recipe_ingredient_created_at',
      'rp_ing.recipe_ingredient_modified_at',
      
      'rp_ing.recipe_id',
      
      'rp_ing.ingredient_id',
      'ing.ingredient_name',
      'ing.ingredient_created_at',
      'ing.ingredient_modified_at',
      
      'ing.ingredient_type_id',
      'ing_type.ingredient_type_name',
      'ing_type.ingredient_type_created_at',
      'ing_type.ingredient_type_modified_at',
      
      'rp_ing.measurement_unit_id',
      'm_unit.measurement_unit_name',
      'm_unit.measurement_unit_created_at',
      'm_unit.measurement_unit_modified_at'
    );

    let recipe_tags = await db('recipe_tags as rp_tag')
    .join('tags as t', 't.tag_id', 'rp_tag.tag_id')
    .where({
      recipe_id: row.recipe_id
    });

    let recipe_likes = await db('recipe_likes as rp_like')
    .join('users as u', 'u.user_id', 'rp_like.user_id')
    .join('roles as r', 'r.role_id', 'u.role_id')
    .where({
      recipe_id: row.recipe_id
    })
    .orderBy('rp_like.recipe_like_id', 'asc');

    recipe_ingredients = recipe_ingredients.map(rp_ing => {
      return {
        recipe_ingredient_id: rp_ing.recipe_ingredient_id,
        quantity: Number(rp_ing.recipe_ingredient_quantity),
        index: rp_ing.recipe_ingredient_index,
        created_at: rp_ing.recipe_ingredient_created_at,
        modified_at: rp_ing.recipe_ingredient_modified_at,
        
        recipe_id: rp_ing.recipe_id,
        
        ingredient: {
          ingredient_id: rp_ing.ingredient_id,
          name: rp_ing.ingredient_name,
          created_at: rp_ing.ingredient_created_at,
          modified_at: rp_ing.ingredient_modified_at,
        },
        
        ingredient_type: {
          ingredient_type_id: rp_ing.ingredient_type_id,
          ingredient_type_name: rp_ing.ingredient_type_name,
          ingredient_type_created_at: rp_ing.ingredient_type_created_at,
          ingredient_type_modified_at: rp_ing.ingredient_type_modified_at
        },
        
        measurement_unit: {
          measurement_unit_id: rp_ing.measurement_unit_id,
          measurement_unit_name: rp_ing.measurement_unit_name,
          measurement_unit_created_at: rp_ing.measurement_unit_created_at,
          measurement_unit_modified_at: rp_ing.measurement_unit_modified_at
        }
      }
    })

    recipe_tags = recipe_tags.map(rp_tag => {
      return {
        recipe_tag_id: rp_tag.recipe_tag_id,
        index: rp_tag.recipe_tag_index,
        created_at: rp_tag.recipe_tag_created_at,
        modified_at: rp_tag.recipe_tag_modified_at,
        
        recipe_id: rp_tag.recipe_id,
        
        tag: {
          tag_id: rp_tag.tag_id,
          text: rp_tag.tag_text,
          created_at: rp_tag.tag_created_at,
          modified_at: rp_tag.tag_modified_at
        }

      }
    });

    recipe_likes = recipe_likes.map(rp_like => {
      return {
        recipe_like_id: rp_like.recipe_like_id,
        created_at: rp_like.recipe_like_created_at,
        modified_at: rp_like.recipe_like_modified_at,
        
        recipe_id: rp_like.recipe_id,
        
        user: {
          user_id: rp_like.user_id,
          username: rp_like.user_username,
          email: rp_like.user_email,
          created_at: rp_like.user_created_at,
          modified_at: rp_like.user_modified_at,
          role: {
            role_id: rp_like.role_id,
            name: rp_like.role_name,
            description: rp_like.role_description,
            created_at: rp_like.role_created_at,
            modified_at: rp_like.role_modified_at,
          }
        }
      }
    })
    
    const recipe = {
      recipe_id: row.recipe_id,
      name: row.recipe_name,
      description: row.recipe_description,
      difficulty: row.recipe_difficulty,
      prep_duration: JSON.parse(row.recipe_prep_duration),
      cook_duration: JSON.parse(row.recipe_cook_duration),
      servings: row.recipe_servings,
      created_at: row.recipe_created_at,
      modified_at: row.recipe_modified_at,
      
      cuisine_type: {
        cuisine_type_id: row.cuisine_type_id,
        name: row.cuisine_type_name,
        created_at: row.cuisine_type_created_at,
        modified_at: row.cuisine_type_modified_at,
      },

      user: {
        user_id: row.user_id,
        username: row.user_username,
        email: row.user_email,
        created_at: row.user_created_at,
        modified_at: row.user_modified_at,

        role: {
          role_id: row.role_id,
          name: row.role_name,
          description: row.role_description,
          created_at: row.role_created_at,
          modified_at: row.role_modified_at
        }

      },

      recipe_steps: recipe_steps.length === 0 
      ? [] 
      : recipe_steps.sort((a, b) => a.index - b.index),
      
      recipe_ingredients: recipe_ingredients.length === 0 
      ? []
      : recipe_ingredients.sort((a, b) => a.index - b.index),

      recipe_tags: recipe_tags.length === 0 
      ? []
      : recipe_tags.sort((a, b) => a.index - b.index),

      recipe_likes
    }

    return recipe;
  })

  recipes = await Promise.all(recipes);

  return recipes;
}

module.exports = {
  findAll
}