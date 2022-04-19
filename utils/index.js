const isEmptyObject = require('./isEmptyObject')
const { generateJWT, generateJWTForUser } = require('./generate-jwt');

const intToBool = int => int !== 0 ? true : false;
const boolToInt = bool => bool === false ? 0 : 1;

module.exports = {
  isEmptyObject,
  intToBool,
  boolToInt,
  generateJWTForUser,
  generateJWT
}