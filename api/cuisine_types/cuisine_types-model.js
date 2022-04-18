const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('cuisine_types as c_type')
  .select(
    'c_type.cuisine_type_id',
    'c_type.cuisine_type_name as name',
    'c_type.cuisine_type_created_at as created_at',
    'c_type.cuisine_type_modified_at as modified_at'
  )
  .orderBy('c_type.cuisine_type_name', 'asc');
  return rows;
}
module.exports = {
  findAll
}