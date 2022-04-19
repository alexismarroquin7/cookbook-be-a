const Recipe = require('./recipes-model');

const validateRecipeExistsByRecipeId = async (req, res, next) => {
  const { recipe_id } = req.params;
  try {
    const recipe = await Recipe.findByRecipeId(Number(recipe_id));
    
    if(recipe){
      req.recipe = recipe;
      next();
    
    } else {
      next({
        status: 404,
        message: 'recipe does not exist'
      });
  
    }
  
  } catch (err) {
    next(err);
  }
}

const validateNewRecipeRequiredFields = (req, res, next) => {
  const {
    name,
    description,
    cuisine_type,
    difficulty,
    prep_duration,
    cook_duration,
    servings,
    ingredients,
    steps,
    tags,
    user_id
  } = req.body;

  if(!name){
    next({
      status: 400,
      message: 'name is a required field'
    });
  } else if(!description){
    next({
      status: 400,
      message: 'description is a required field'
    });
  } else if(!cuisine_type || typeof cuisine_type.name !== "string"){
    next({
      status: 400,
      message: 'cuisine_type.text is a required field'
    });
  } else if(!difficulty){
    next({
      status: 400,
      message: 'difficulty is a required field'
    });
  } else if(!prep_duration || typeof prep_duration.hours !== "number"){
    next({
      status: 400,
      message: 'prep_duration.hours is a required field'
    });
  } else if(!prep_duration || typeof prep_duration.minutes !== "number"){
    next({
      status: 400,
      message: 'prep_duration.minutes is a required field'
    });
  } else if(!cook_duration || typeof cook_duration.hours !== "number"){
    next({
      status: 400,
      message: 'cook_duration.hours is a required field'
    });
  } else if(!cook_duration || typeof cook_duration.minutes !== "number"){
    next({
      status: 400,
      message: 'cook_duration.minutes is a required field'
    });
  } else if(typeof servings !== "number"){
    next({
      status: 400,
      message: 'servings is a required field'
    });
  } else if(!Array.isArray(ingredients)){
    next({
      status: 400,
      message: 'ingredients is a required field'
    });
  } else if(!Array.isArray(steps)){
    next({
      status: 400,
      message: 'steps is a required field'
    });
  } else if(!Array.isArray(tags)){
    next({
      status: 400,
      message: 'tags is a required field'
    });
  } else if(!user_id){
    next({
      status: 400,
      message: 'user_id is a required field'
    });
  } else {
    next();
  }
}

module.exports = {
  validateRecipeExistsByRecipeId,
  validateNewRecipeRequiredFields
}