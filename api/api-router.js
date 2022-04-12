const router = require('express').Router();

const rolesRouter = require('./roles/roles-router');
const recipesRouter = require('./recipes/recipes-router');
const ingredientsRouter = require('./ingredients/ingredients-router');
const authRouter = require('./auth/auth-router');

router.use('/roles', rolesRouter);
router.use('/recipes', recipesRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/auth', authRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;