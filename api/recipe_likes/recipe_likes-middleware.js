const RecipeLike = require('./recipe_likes-model');

const validateRecipeLikeExistsByRecipeLikeId = async (req, res, next) => {
  const { recipe_like_id } = req.params;

  try {
    const recipe_like = await RecipeLike.findByRecipeLikeId(Number(recipe_like_id));
    if(recipe_like){
      req.recipe_like = recipe_like;
      next();
    } else {
      next({
        status: 404,
        message: 'recipe_like does not exist'
      });
    }
  } catch (err) {
    next(err);
  }

}

const validateNewRecipeLikeRequiredFields = async (req, res, next) => {
  const { recipe_id, user_id } = req.body;

  if(!recipe_id || !user_id){
    next({
      status: 400,
      message: 'recipe_id and user_id are required'
    })
  } else {
    next();
  }
}

const validateRecipeLikeUnique = async (req, res, next) => {
  
  const { recipe_id, user_id } = req.body;

  try {
    
    const recipes = await RecipeLike.findBy({
      'recipe_id': recipe_id,
      'u.user_id': user_id
    });

    if(!recipes){
      next();
    } else {
      next({
        status: 400,
        message: 'recipe already liked'
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateRecipeLikeExistsByRecipeLikeId,
  validateNewRecipeLikeRequiredFields,
  validateRecipeLikeUnique
}