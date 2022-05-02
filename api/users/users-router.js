const router = require('express').Router();
const { validateUserExistsById } = require('./users-middleware');
const User = require('./users-model');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:user_id', validateUserExistsById, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:user_id/feed/home', validateUserExistsById, async (req, res, next) => {
  try {
    const home_feed = await User.getHomeFeed(req.user.user_id);
    res.status(200).json(home_feed);
  } catch (err) {
    next(err);
  }
});

router.get('/:user_id/feed/activity', validateUserExistsById, async (req, res, next) => {
  try {
    const activity_feed = await User.getActivityFeed(req.user.user_id);
    res.status(200).json(activity_feed);
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