const db = require('../data/db-config');

const findAll = async () => {
  const measurement_units = await db('measurement_units as m')
  .select(
    "measurement_unit_id",
    "measurement_unit_name as name",
    "measurement_unit_created_at as created_at",
    "measurement_unit_modified_at as modified_at"
  );
  return measurement_units;
}

module.exports = {
  findAll
}