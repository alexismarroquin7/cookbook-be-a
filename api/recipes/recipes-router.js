const router = require('express').Router();
const Recipe = require('./recipes-model');
const {
  validateRecipeExistsByRecipeId,
  validateRecipeRequiredFields
} = require('./recipes-middleware');

router.get('/', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/:recipe_id',
  validateRecipeExistsByRecipeId,
  (req, res) => {
    res.status(200).json(req.recipe);
  }
);

router.post(
  '/',
  validateRecipeRequiredFields,
  async (req, res, next) => {
    try {
      const recipe = await Recipe.create(req.body);
      res
      .status(201)
      .json(recipe)
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/:recipe_id',
  validateRecipeExistsByRecipeId,
  validateRecipeRequiredFields,
  async (req, res, next) => {
    try {
      const recipe = await Recipe.updateByRecipeId(req.recipe.recipe_id, req.body);
      res.status(200).json(recipe);
    } catch (err) {
      next(err);
    }
  }
)

router.delete(
  '/:recipe_id',
  validateRecipeExistsByRecipeId,
  async (req, res, next) => {
    try {
      const deletedRecipe = await Recipe.deleteByRecipeId(req.recipe.recipe_id);
      res.status(200).json({ recipe_id: deletedRecipe.recipe_id });
    } catch (err) {
      next(err);
    }
  }
)

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;