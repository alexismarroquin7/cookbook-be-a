const router = require('express').Router();
const UserFollower = require('./user_followers-model');
const {
  validateUserFollowerExistsByUserFollowerId,
  validateUserFollowerRequiredFields
} = require('./user_followers-middleware');

router.get('/', async (req, res, next) => {
  try {
    const user_followers = await UserFollower.findAll();
    res.status(200).json(user_followers);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/:user_follower_id',
  validateUserFollowerExistsByUserFollowerId,
  (req, res) => {
  res.status(200).json(req.user_follower);
});

router.post(
  '/',
  validateUserFollowerRequiredFields,
  async (req, res, next) => {
    try {
      const user_follower = await UserFollower.create(req.body);
      res.status(201).json(user_follower);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:user_follower_id',
  validateUserFollowerExistsByUserFollowerId,
  async (req, res, next) => {
  try {
    const user_follower = await UserFollower.deleteByUserFollowerId(req.user_follower.user_follower_id);
    res.status(200).json(user_follower);
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