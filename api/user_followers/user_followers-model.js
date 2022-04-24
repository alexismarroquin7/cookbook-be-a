const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('user_followers');

  let user_followers = rows.map(async row => {
    
    let user = await db('users as u')
    .join('roles as r', 'r.role_id', 'u.role_id')
    .where({
      user_id: row.user_id
    })
    .first();
    
    let follower = await db('users as u')
    .join('roles as r', 'r.role_id', 'u.role_id')
    .where({
      user_id: row.follower_id
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
    
    follower = {
      follower_id: follower.user_id,
      username: follower.user_username,
      display_name: follower.user_display_name,
      email: follower.user_email,
      created_at: follower.user_created_at,
      modified_at: follower.user_modified_at,
      role: {
        role_id: follower.role_id,
        name: follower.role_name,
        description: follower.role_description,
        created_at: follower.role_created_at,
        modified_at: follower.role_modified_at
      }
    }
    
    return {
      user_follower_id: row.user_follower_id,
      follower,
      user,
      created_at: row.user_follower_created_at,
      modified_at: row.user_follower_modified_at,
    }
  });

  user_followers = Promise.all(user_followers);

  return user_followers;
}

const findByFollowerId = async (user_follower_id) => {
  const user_followers = await findAll();
  const userFollowers = user_followers.filter(uf => uf.user_follower_id === user_follower_id);
  if(userFollowers.length === 0){
    return null;
  } else {
    return userFollowers[0];
  }
}

const create = async ({follower_id, user_id}) => {
  const [user_follower] = await db('user_followers as u_fls')
  .insert({
    follower_id,
    user_id
  }, ['u_fls.user_follower_id']);

  await db('user_followings')
  .insert({
    followed_id: user_id,
    user_id: follower_id
  })

  const uf = await findByFollowerId(user_follower.user_follower_id);
  return uf;
}

const deleteByUserFollowerId = async (user_follower_id) => {
  const user_follower = await findByFollowerId(user_follower_id);
  
  await db('user_followers as u_flr')
  .where({
    user_follower_id
  })
  .delete();
  
  await db('user_followings as u_flg')
  .where({
    user_id: user_follower.follower.follower_id,
    followed_id: user_follower.user.user_id
  })
  .delete();

  return user_follower;
}

module.exports = {
  findAll,
  findByFollowerId,
  create,
  deleteByUserFollowerId
}