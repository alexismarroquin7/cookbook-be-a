const router = require('express').Router();
const RecipeLike = require('./recipe_likes-model');
const { validateRecipeLikeExistsByRecipeLikeId, validateNewRecipeLikeRequiredFields, validateRecipeLikeUnique } = require('./recipe_likes-middleware');

router.post(
  '/',
  validateNewRecipeLikeRequiredFields,
  validateRecipeLikeUnique,
  async (req, res, next) => {
    
    const { recipe_id, user_id } = req.body;
    
    try {
      const recipe_like = await RecipeLike.create({ recipe_id, user_id });
      res.status(200).json(recipe_like);
    } catch (err) {
      next(err);
    }
});

router.delete(
  '/:recipe_like_id',
  validateRecipeLikeExistsByRecipeLikeId,
  async (req, res, next) => {
    try {
      const recipe_like = await RecipeLike.deleteByRecipeLikeId(req.recipe_like.recipe_like_id);
      res.status(200).json({
        recipe_like_id: recipe_like.recipe_like_id 
      });
    } catch (err) {
      next(err);
    }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;