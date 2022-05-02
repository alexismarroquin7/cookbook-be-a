const router = require('express').Router();
const RecipeComment = require('./recipe_comments-model');
const { validateRecipeCommentRequiredFields, validateRecipeCommentExistsByRecipeCommentId } = require('./recipe_comments-middleware');

router.get('/', async (req, res, next) => {
  try {
    const recipe_comments = await RecipeComment.findAll();
    res.status(200).json(recipe_comments);
  } catch (err) {
    next(err);
  }
});

router.post('/', validateRecipeCommentRequiredFields, async (req, res, next) => {
  try {
    const recipe_comment = await RecipeComment.create(req.body);
    res.status(200).json(recipe_comment);
  } catch (err) {
    next(err);
  }
})

router.delete('/:recipe_comment_id', validateRecipeCommentExistsByRecipeCommentId, async (req, res, next) => {
  try {
    const recipe_comment = await RecipeComment.deleteByRecipeCommentId(req.recipe_comment.recipe_comment_id);
    res.status(200).json({
      recipe_comment_id: recipe_comment.recipe_comment_id
    });
  } catch (err) {
    next(err);
  }
})

router.put('/:recipe_comment_id', validateRecipeCommentExistsByRecipeCommentId, async (req, res, next) => {
  try {
    const recipe_comment = await RecipeComment.updateByRecipeCommentId(req.recipe_comment.recipe_comment_id, req.body);
    res.status(200).json(recipe_comment);
  } catch (err) {
    next(err);
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;