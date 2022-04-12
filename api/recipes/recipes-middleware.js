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

module.exports = {
  validateRecipeExistsByRecipeId
}