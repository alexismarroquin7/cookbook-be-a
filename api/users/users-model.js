const db = require("../data/db-config");

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
  findBy,
  findByEmail
}