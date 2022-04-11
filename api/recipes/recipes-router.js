const router = require('express').Router();
const Recipe = require('./recipes-model');

router.get('/', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
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