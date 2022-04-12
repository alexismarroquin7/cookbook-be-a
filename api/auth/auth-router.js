const {
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJWT 
} = require('./auth-middleware');

const router = require('express').Router();

router.post(
  '/login',
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJWT,
  async (req, res) => {
    res.status(200).json({
      message: `Welcome back ${req.user.username}`,
      user: {
        ...req.user,
        password: undefined
      },
      token: req.token
    })
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;