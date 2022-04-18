const db = require('../data/db-config');

const findAll = async () => {
  return db('tags as t')
  .select(
    "tag_id",
    "tag_text as text",
    "tag_created_at as created_at",
    "tag_modified_at as modified_at"
  );
}

module.exports = {
  findAll
}