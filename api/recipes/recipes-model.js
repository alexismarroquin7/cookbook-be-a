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
          name: rp_ing.ingredient_type_name,
          created_at: rp_ing.ingredient_type_created_at,
          modified_at: rp_ing.ingredient_type_modified_at
        },
        
        measurement_unit: {
          measurement_unit_id: rp_ing.measurement_unit_id,
          name: rp_ing.measurement_unit_name,
          created_at: rp_ing.measurement_unit_created_at,
          modified_at: rp_ing.measurement_unit_modified_at
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
          display_name: rp_like.user_display_name,
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
        display_name: row.user_display_name,
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

const findByRecipeId = async (recipe_id) => {

  let recipe = await db('recipes as r').where({recipe_id}).first();
  
  if(!recipe) return null;
  
  const recipes = await findAll();
  
  [ recipe ] = recipes.filter(r => r.recipe_id === recipe_id);
  
  return recipe;
}

const create = async (recipe) => {
  
  let cuisine_type_id;

  const cuisine_type = await db('cuisine_types as c_type')
  .where({
    'c_type.cuisine_type_name': recipe.cuisine_type.name
  })
  .first();

  if(cuisine_type){
    cuisine_type_id = cuisine_type.cuisine_type_id;
  } else {
    cuisine_type_id = await db('cuisine_types as c_type')
    .insert({
      cuisine_type_name: recipe.cuisine_type.name
    }, ['c_type.cuisine_type_id']);
  }
  
  const [newRecipe] = await db('recipes as r')
  .insert({
    recipe_name: recipe.name.trim(),
    recipe_description: recipe.description.trim(),
    recipe_difficulty: recipe.difficulty,
    recipe_prep_duration: JSON.stringify(recipe.prep_duration),
    recipe_cook_duration: JSON.stringify(recipe.cook_duration),
    recipe_servings: Number(recipe.servings),
    cuisine_type_id: cuisine_type_id,
    user_id: recipe.user_id
  }, ['r.recipe_id']);

  Promise.all(recipe.ingredients.forEach(async rp_ingredient => {

    const ingredientToUse = await db('ingredients')
    .where({
      ingredient_name: rp_ingredient.name
    })
    .first();
    
    const measurementUnitToUse = await db('measurement_units')
    .where({
      measurement_unit_name: rp_ingredient.measurement_unit
    })
    .first();
    
    await db('recipe_ingredients')
    .insert({
      recipe_ingredient_quantity: Number(rp_ingredient.quantity),
      recipe_ingredient_index: rp_ingredient.index,
      ingredient_id: ingredientToUse.ingredient_id,
      measurement_unit_id: measurementUnitToUse.measurement_unit_id,
      recipe_id: newRecipe.recipe_id
    });
  }));

  Promise.all(recipe.steps.forEach(async step => {
    await db('recipe_steps')
    .insert({
      recipe_step_text: step.text,
      recipe_step_index: step.index,
      recipe_id: newRecipe.recipe_id
    })
  }))
  
  Promise.all(recipe.tags.forEach(async tag => {
    let tag_id;

    const storedTag = await db('tags')
    .where({
      tag_text: tag.text
    })
    .first();

    if(storedTag){
      tag_id = storedTag.tag_id;
    
    } else {      
      const [ newTag ] = await db('tags')
      .insert({
        tag_text: tag.text
      }, ['tags.tag_id']);

      tag_id = newTag.tag_id;

    }
  
    await db('recipe_tags')
    .insert({
      recipe_tag_index: tag.index,
      tag_id: tag_id,
      recipe_id: newRecipe.recipe_id
    });
  }));

  const newRecipeToUse = await findByRecipeId(newRecipe.recipe_id);

  return newRecipeToUse;
}

const updateByRecipeId = async (recipe_id, changes) => {
  
  const ogRecipe = await findByRecipeId(recipe_id);

  const cuisine_type = await db('cuisine_types as c_type')
  .where({
    cuisine_type_name: changes.cuisine_type.name
  })
  .first();

  await db('recipes as r')
  .where({
    recipe_id
  })
  .update({
    recipe_name: changes.name || ogRecipe.name,
    recipe_description: changes.description || ogRecipe.description,
    recipe_difficulty: changes.difficulty || ogRecipe.difficulty,
    recipe_prep_duration: JSON.stringify(changes.prep_duration) || JSON.stringify(ogRecipe.prep_duration),
    recipe_cook_duration: JSON.stringify(changes.cook_duration) || JSON.stringify(ogRecipe.cook_duration),
    recipe_servings: typeof changes.servings === 'number' 
    ? changes.servings 
    : ogRecipe.servings,
    user_id: typeof changes.user_id === 'number' 
    ? changes.user_id 
    : ogRecipe.user_id,
    cuisine_type_id: cuisine_type.cuisine_type_id,
    recipe_modified_at: db.fn.now(), 
    recipe_created_at: ogRecipe.created_at
  });

  // ingredients
  await db('recipe_ingredients as rp_ing')
  .where({
    recipe_id
  })
  .delete()

  changes.ingredients.forEach(async ing => {
    const ingredientFound = await db('ingredients as ing')
    .where({
      ingredient_name: ing.name
    })
    .first();
    
    const measurementUnitFound = await db('measurement_units as m_unit')
    .where({
      measurement_unit_name: ing.measurement_unit
    })
    .first();
    
    await db('recipe_ingredients')
    .insert({
      ingredient_id: ingredientFound.ingredient_id,
      recipe_ingredient_index: ing.index,
      recipe_ingredient_quantity: ing.quantity,
      measurement_unit_id: measurementUnitFound.measurement_unit_id,
      recipe_id
    });
  })

  // steps
  await db('recipe_steps as rp_step')
  .where({
    recipe_id
  })
  .delete()

  changes.steps.forEach(async step => {
    await db('recipe_steps as rp_step')
    .insert({
      recipe_step_text: step.text,
      recipe_step_index: step.index,
      recipe_id
    })
  })
  
  // tags
  await db('recipe_tags as rp_tag')
  .where({
    recipe_id
  })
  .delete()
  
  changes.tags.forEach(async tag => {
    const tagFound = await db('tags')
    .where({
      tag_text: tag.text
    })
    .first();
    
    let tag_id_to_use;
    
    if(tagFound){
      tag_id_to_use = tagFound.tag_id;
    } else {
      const [ tagToUse ] = await db('tags as t')
      .insert({
        tag_text: tag.text
      }, ['t.tag_id']);

      tag_id_to_use = tagToUse.tag_id;
    }
    
    await db('recipe_tags')
    .insert({
      tag_id: tag_id_to_use,
      recipe_tag_index: tag.index,
      recipe_id
    });

  });

  // delete unused tags
  const tagsToDelete = await db('tags');

  tagsToDelete.forEach(async tag => {
    
    const filteredByTagId = await db('recipe_tags')
    .where({
      tag_id: tag.tag_id
    })
    .first()
    if(!filteredByTagId){
      await db('tags')
      .where({
        tag_id: tag.tag_id
      })
      .delete()
    }
  });
  
  const updatedRecipe = await findByRecipeId(recipe_id);

  return updatedRecipe;
}

const deleteByRecipeId = async (recipe_id) => {
  const recipeToDelete = await findByRecipeId(recipe_id);

  // delete recipe_likes
  await db('recipe_likes as rp_like')
  .where({
    recipe_id
  })
  .delete();


  // delete recipe_steps
  await db('recipe_steps as rp_step')
  .where({
    recipe_id
  })
  .delete();

  // delete recipe_ingredients
  await db('recipe_ingredients as rp_ing')
  .where({
    recipe_id
  })
  .delete();

  // delete recipe_tags
  await db('recipe_tags as rp_tag')
  .where({
    recipe_id
  })
  .delete();
  
  recipeToDelete.recipe_tags.forEach(async rp_tag => {
    // check if tag is being used by other recipes
    const recipesWithSameTag = await db('recipe_tags')
    .where({
      tag_id: rp_tag.tag.tag_id
    });
    
    // delete tags that are unused
    if(recipesWithSameTag.length === 0){
      await db('tags as t')
      .where({
        tag_id: rp_tag.tag.tag_id
      })
      .delete();
    }

  });

  await db('recipes as r')
  .where({
    recipe_id: recipeToDelete.recipe_id
  })
  .delete();

  return recipeToDelete;
}

module.exports = {
  findAll,
  findByRecipeId,
  create,
  updateByRecipeId,
  deleteByRecipeId
}