const User = require('../users/users-model');

const { generateJWTForUser } = require('../../utils');

const bcrypt = require('bcryptjs');


const validateLoginRequiredFields = async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password){
    next({
      status: 400,
      message: 'email and password are required to login'
    })
  } else {
    next();
  }
  
}

const validateUserExistsByEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findByEmail(email);
    if(user){
      req.user = user;
      next();
    } else {
      next({
        status: 404,
        message: 'user does not exist'
      });
      
    }
    
  } catch (err) {
    next(err);
  }
}

const validatePassword = async (req, res, next) => {
  const { password } = req.body;
  
  const valid = bcrypt.compareSync(password, req.user.password);
  
  if(valid){
    next();
  
  } else {
    next({
      status: 400,
      message: "incorrect password"
    });
  }
} 

const handleJWT = (req, res, next) => {
  try {
    const token = generateJWTForUser(req.user);
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJWT
};