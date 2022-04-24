const UserFollower = require('./user_followers-model');

const validateUserFollowerExistsByUserFollowerId = async (req, res, next) => {
  const { user_follower_id } = req.params;

  try {
    const user_follower = await UserFollower.findByFollowerId(Number(user_follower_id));
    if(user_follower){
      req.user_follower = user_follower;
      next();
    } else {
      next({
        status: 404,
        message: 'user_follower does not exist'
      });
    }
  } catch (err) {
    next(err);
  }
}

const validateUserFollowerRequiredFields = async (req, res, next) => {
  const { 
    user_id,
    follower_id
  } = req.body;

  if(!user_id || !follower_id){
    next({
      status: 400,
      message: 'missing required fields'
    })
  } else {
    next();
  }

}

module.exports = {
  validateUserFollowerExistsByUserFollowerId,
  validateUserFollowerRequiredFields
}