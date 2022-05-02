const db = require('../data/db-config');

const RecipeComment = require('../recipe_comments/recipe_comments-model');
const RecipeStep = require('../recipe_steps/recipe_steps-model');
const RecipeIngredient = require('../recipe_ingredients/recipe_ingredients-model');
const RecipeTag = require('../recipe_tags/recipe_tags-model');
const RecipeLike = require('../recipe_likes/recipe_likes-model');

const findAll = async ({
  sort = 'desc',
  orderBy = 'recipe_id',
  tag = '',
  name = ''
}) => {

  if(sort !== ('desc' || 'asc')){
    throw Error('sort must be "asc" or "desc"')
  }
  
  if(orderBy === 'recipe_id'){
    orderBy = 'rp.recipe_id'
  } else {
    throw Error(`unknown orderBy query: ${orderBy}`)
  }


  const rows = await db('recipes as rp')
  .leftJoin('cuisine_types as c_type', 'c_type.cuisine_type_id', 'rp.cuisine_type_id')
  .leftJoin('users as u', 'u.user_id', 'rp.user_id')
  .leftJoin('roles as r', 'r.role_id', 'u.role_id')
  .orderBy(orderBy, sort);

  let recipes = rows.map(async row => {
    
    const recipe_steps = await RecipeStep.findByRecipeId(row.recipe_id);
    const recipe_ingredients = await RecipeIngredient.findByRecipeId(row.recipe_id)    
    const recipe_tags = await RecipeTag.findByRecipeId(row.recipe_id)
    const recipe_likes = await RecipeLike.findByRecipeId(row.recipe_id);
    const recipe_comments = await RecipeComment.findByRecipeId(row.recipe_id);
    
    const cuisine_type = {
      cuisine_type_id: row.cuisine_type_id,
      name: row.cuisine_type_name,
      created_at: row.cuisine_type_created_at,
      modified_at: row.cuisine_type_modified_at,
    }

    const user = {
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
    
    }

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
      
      cuisine_type,

      user,

      recipe_steps,
      
      recipe_ingredients,

      recipe_tags,

      recipe_comments,

      recipe_likes
    }

    return recipe;
  })

  recipes = await Promise.all(recipes);

  if(name && !tag){
    const regex = new RegExp(name, 'i');
    recipes = recipes.filter(r => {
      const match = regex.test(r.name);
      return match;
    })
    
  } else if(!name && tag){
    recipes = recipes.filter(r => {
      let match = false;
      
      r.recipe_tags.forEach(rp_tag => {
        if(rp_tag.tag.text === tag){    
          match = true;
        }
      })

      return match;
    });
  }

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

  await db('recipes as r')
  .where({
    recipe_id: recipeToDelete.recipe_id
  })
  .delete();

  return recipeToDelete;
}

const findByUserId = async (user_id, query = {}) => {
  const recipes = await findAll(query);
  return recipes.filter(recipe => recipe.user.user_id === user_id);
}

const findByUserIds = async (user_ids = [], query = {}) => {
  let recipes = await findAll(query);
  
  recipes = recipes
  .filter(recipe => {
    let match = false;
    
    user_ids.forEach(user_id => {
      if(recipe.user.user_id === user_id){
        match = true;
      }
    });

    return match;
  });

  return recipes;
}

module.exports = {
  findAll,
  findByRecipeId,
  create,
  updateByRecipeId,
  deleteByRecipeId,
  findByUserId,
  findByUserIds
}