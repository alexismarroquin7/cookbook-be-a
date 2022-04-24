const db = require("../data/db-config");

const findAll = async () => {
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .orderBy('u.user_id', 'asc');

  if(rows.length === 0) return [];

  let users = rows.map(async row => {
    
    let following = await db('user_followings as uf')
    .leftJoin('users as u', 'u.user_id', 'uf.followed_id')
    .where({
      'uf.user_id': row.user_id
    })
    .select(
      "uf.user_following_id",
      "uf.followed_id",
      "uf.user_id",
      "uf.user_following_created_at",
      "uf.user_following_modified_at",
      "u.user_username",
      "u.user_display_name",
      "u.user_email",
      "u.user_created_at",
      "u.user_modified_at",
    )
    .orderBy('user_following_id', 'asc');
    
    if(following.length === 0) following = [];
    
    following = following.map(followItem => {
      const follow = {
        followed_id: followItem.followed_id,
        username: followItem.user_username,
        display_name: followItem.user_display_name,
        email: followItem.user_email,
        created_at: followItem.user_created_at,
        modified_at: followItem.user_modified_at
      }
      
      const user_following = {
        user_following_id: followItem.user_following_id,
        follow,
        user: {
          user_id: followItem.user_id
        },
        created_at: followItem.user_following_created_at,
        modified_at: followItem.user_following_modified_at
      }
      
      return user_following;
    });

    let followers = await db('user_followers as uf')
    .leftJoin('users as u', 'u.user_id', 'uf.follower_id')
    .where({
      'uf.user_id': row.user_id
    })
    .select(
      "uf.user_follower_id",
      "uf.follower_id",
      "uf.user_id",
      "uf.user_follower_created_at",
      "uf.user_follower_modified_at",
      "u.user_username",
      "u.user_display_name",
      "u.user_email",
      "u.user_created_at",
      "u.user_modified_at"
    )
    .orderBy('user_follower_id', 'asc');

    if(followers.length === 0) followers = [];
    
    followers = followers.map(follower => {
      const followerToUse = {
        follower_id: follower.follower_id,
        username: follower.user_username,
        display_name: follower.user_display_name,
        email: follower.user_email,
        created_at: follower.user_created_at,
        modified_at: follower.user_modified_at
      }
      
      const user_follower = {
        user_follower_id: follower.user_follower_id,
        follower: followerToUse,
        user: {
          user_id: follower.user_id
        },
        created_at: follower.user_following_created_at,
        modified_at: follower.user_following_modified_at
      }
      
      return user_follower;
    });

    return {
      user_id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      email: row.user_email,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,

      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      },
      
      following,
      followers
    }
  })

  users = Promise.all(users);

  return users;
}

const findBy = async (filter) => {
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where(filter)
  .orderBy('u.user_id', 'asc');

  if(rows.length === 0) return [];

  const users = rows.map(row => {
    return {
      user_id: row.user_id,
      username: row.user_username,
      display_name: row.user_display_name,
      email: row.user_email,
      password: row.user_password,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,

      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      }
    }
  })

  return users;
}

const findByEmail = async (email) => {
  const users = await findBy({ user_email: email });
  
  if(users.length === 0){
    return null;
  } else {
    return users[0];
  }
}

module.exports = {
  findAll,
  findBy,
  findByEmail
}