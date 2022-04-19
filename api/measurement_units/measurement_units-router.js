const router = require('express').Router();
const MeasurementUnit = require('./measurement_units-model');

router.get('/', async (req, res, next) => {
  try {
    const measurement_units = await MeasurementUnit.findAll();
    res.status(200).json(measurement_units);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;