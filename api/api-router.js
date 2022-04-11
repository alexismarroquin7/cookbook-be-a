const router = require('express').Router();

const rolesRouter = require('./roles/roles-router');
const recipesRouter = require('./recipes/recipes-router');

router.use('/roles', rolesRouter);
router.use('/recipes', recipesRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;