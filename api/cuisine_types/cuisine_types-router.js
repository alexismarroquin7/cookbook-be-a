const router = require('express').Router();
const CuisineType = require('./cuisine_types-model');

router.get('/', async (req, res, next) => {
  try {
    const cuisine_types = await CuisineType.findAll();
    res.status(200).json(cuisine_types);
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