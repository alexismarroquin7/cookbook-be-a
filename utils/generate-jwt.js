const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function generateJWT(payload, options){
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

function generateJWTForUser(user){
  const { user_id, username, email, role } = user;
  
  const payload = {
    subject: user_id,
    email,
    username,
    role: { 
      role_id: role.role_id,
      name: role.name 
    }
  };

  const options = {
    expiresIn: '1d'
  };

  const token = generateJWT(payload, options);
  
  return token;
}

module.exports = {
  generateJWTForUser,
  generateJWT
}