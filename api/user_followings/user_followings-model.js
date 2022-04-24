const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('user_followings');

  let user_followings = rows.map(async row => {
    
    let user = await db('users as u')
    .join('roles as r', 'r.role_id', 'u.role_id')
    .where({
      user_id: row.user_id
    })
    .first();
    
    let followed = await db('users as u')
    .join('roles as r', 'r.role_id', 'u.role_id')
    .where({
      user_id: row.followed_id
    })
    .first();

    user = {
      user_id: user.user_id,
      username: user.user_username,
      display_name: user.user_display_name,
      email: user.user_email,
      created_at: user.user_created_at,
      modified_at: user.user_modified_at,
      role: {
        role_id: user.role_id,
        name: user.role_name,
        description: user.role_description,
        created_at: user.role_created_at,
        modified_at: user.role_modified_at
      }
    }
    
    followed = {
      followed_id: followed.user_id,
      username: followed.user_username,
      display_name: followed.user_display_name,
      email: followed.user_email,
      created_at: followed.user_created_at,
      modified_at: followed.user_modified_at,
      role: {
        role_id: followed.role_id,
        name: followed.role_name,
        description: followed.role_description,
        created_at: followed.role_created_at,
        modified_at: followed.role_modified_at
      }
    }
    
    return {
      user_following_id: row.user_following_id,
      followed,
      user,
      created_at: row.user_following_created_at,
      modified_at: row.user_following_modified_at,
    }
  });

  user_followings = Promise.all(user_followings);

  return user_followings;
}

module.exports = {
  findAll
}