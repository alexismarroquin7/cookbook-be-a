const bcrypt = require('bcryptjs');

const rounds = process.env.DB_ROUNDS 
? Number(process.env.DB_ROUNDS) 
: 8;

const userPassword = process.env.TEST_USER_PASSWORD || '1234';
const hash = bcrypt.hashSync(userPassword, rounds);

const users = [
  {
    user_username: 'mordecai',
    user_display_name: 'Mordo',
    user_email: 'mordecai@gmail.com',	
    user_bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    user_password: hash,
    role_id: 1
  },
  {
    user_username: 'rigby',
    user_display_name: 'Rigbo',
    user_email: 'rigby@gmail.com',	
    user_password: hash,
    role_id: 1
  },
  {
    user_username: 'benson',
    user_display_name: 'Boss',
    user_email: 'benson@gmail.com',	
    user_password: hash,
    role_id: 1
  },
  {
    user_username: 'starla',
    user_display_name: 'Starla M',
    user_email: 'starla@gmail.com',	
    user_password: hash,
    role_id: 1
  },
  {
    user_username: 'muscle_man',
    user_display_name: 'Muscle Man',
    user_email: 'muscleman@gmail.com',	
    user_password: hash,
    role_id: 1
  },
  {
    user_username: 'skips',
    user_display_name: 'Skips the man',
    user_email: 'skips@gmail.com',	
    user_password: hash,
    role_id: 2
  },
  {
    user_username: 'pops',
    user_email: 'pops@gmail.com',	
    user_password: hash,
    role_id: 2
  },
  {
    user_username: 'margaret',
    user_email: 'margaret@gmail.com',	
    user_password: hash,
    role_id: 2
  },
];

module.exports = users;