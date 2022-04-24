const router = require('express').Router();

const rolesRouter = require('./roles/roles-router');
const recipesRouter = require('./recipes/recipes-router');
const ingredientsRouter = require('./ingredients/ingredients-router');
const authRouter = require('./auth/auth-router');
const recipeLikesRouter = require('./recipe_likes/recipe_likes-router');
const usersRouter = require('./users/users-router');
const cuisineTypesRouter = require('./cuisine_types/cuisine_types-router');
const measurementUnitsRouter = require('./measurement_units/measurement_units-router');
const tagsRouter = require('./tags/tags-router');
const userFollowingsRouter = require('./user_followings/user_followings-router');
const userFollowersRouter = require('./user_followers/user_followers-router');

router.use('/roles', rolesRouter);
router.use('/recipes', recipesRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/auth', authRouter);
router.use('/recipe_likes', recipeLikesRouter);
router.use('/cuisine_types', cuisineTypesRouter);
router.use('/users', usersRouter);
router.use('/measurement_units', measurementUnitsRouter);
router.use('/tags', tagsRouter);
router.use('/user_followings', userFollowingsRouter);
router.use('/user_followers', userFollowersRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;