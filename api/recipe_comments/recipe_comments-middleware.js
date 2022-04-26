const RecipeComment = require("./recipe_comments-model");

const validateRecipeCommentRequiredFields = async (req, res, next) => {
  const { recipe_id, user_id, text } = req.body;
  
  if(!recipe_id || !user_id || !text){
    next({
      status: 400,
      message: 'missing required fields'
    })
  } else {
    next();
  }

}

const validateRecipeCommentExistsByRecipeCommentId = async (req, res, next) => {
  const {recipe_comment_id} = req.params;
  try {
    const recipe_comment = await RecipeComment.findByRecipeCommentId(Number(recipe_comment_id));
    if(recipe_comment){
      req.recipe_comment = recipe_comment;
      next();
    } else {
      next({
        status: 404,
        message: 'comment does not exist'
      });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateRecipeCommentRequiredFields,
  validateRecipeCommentExistsByRecipeCommentId
}