const db = require("../data/db-config");

const UserFollower = require('../user_followers/user_followers-model');
const UserFollowing = require('../user_followings/user_followings-model');

const findAll = async (config = {}) => {
  
  const hidePassword = typeof config.hidePassword === "boolean" ? config.hidePassword : true;
  
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .orderBy('u.user_id', 'asc');

  if(rows.length === 0) return [];

  let users = rows.map(async row => {

    const followers = await UserFollower.findByUserId(row.user_id);
    const following = await UserFollowing.findByUserId(row.user_id);

    return {
      user_id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      bio: row.user_bio,
      email: row.user_email,
      password: hidePassword ? undefined : row.user_password,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,

      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      },
      
      followers,
      following
    }
  })

  users = Promise.all(users);

  return users;
}

const findBy = async (filter, config = {}) => {

  const hidePassword = typeof config.hidePassword === "boolean" ? config.hidePassword : true;

  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where(filter)
  .orderBy('u.user_id', 'asc');

  if(rows.length === 0) return [];

  const users = Promise.all(rows.map(async row => {
    const followers = await UserFollower.findByUserId(row.user_id);
    const following = await UserFollowing.findByUserId(row.user_id);
    return {
      user_id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      bio: row.user_bio,
      email: row.user_email,
      password: hidePassword ? undefined : row.user_password,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,

      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      },
      followers,
      following
    }
  }))

  return users;
}

const findByUserId = async (user_id, config = {}) => {
  const users = await findBy({ user_id }, config);
  
  if(users.length === 0) return null;

  return users[0];
}

const findByEmail = async (email, config = {}) => {
  const users = await findBy({ user_email: email }, config);
  
  if(users.length === 0) return null;

  return users[0];
}

const findByUsername = async (username, config = {}) => {
  const users = await findBy({ user_username: username }, config);
  
  if(users.length === 0) return null;

  return users[0];
}

module.exports = {
  findAll,
  findBy,
  findByEmail,
  findByUsername,
  findByUserId
}