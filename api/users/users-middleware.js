const User = require('./users-model');

const validateUserExistsById = async (req, res, next) => {
  
  const { user_id } = req.params;

  try {
    const user = await User.findByUserId(user_id);
    if(user){
      req.user = user;
      next();
    } else {
      next({
        status: 404,
        message: 'user does not exist'
      })
    }
  } catch (err) {
    next(err);
  }

}

module.exports = {
  validateUserExistsById
}