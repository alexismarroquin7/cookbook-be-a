const router = require('express').Router();
const UserFollowing = require('./user_followings-model');

router.get('/', async (req, res, next) => {
  try {
    const user_followings = await UserFollowing.findAll();
    res.status(200).json(user_followings);
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