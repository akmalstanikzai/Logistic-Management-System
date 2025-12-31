const express = require('express');
const router = express.Router();
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getAvailableDrivers
} = require('../controllers/driverController');

// GET available drivers (must be before /:id to avoid route conflict)
router.get('/available', getAvailableDrivers);

// Main CRUD routes
router.route('/')
  .post(createDriver)
  .get(getAllDrivers);

router.route('/:id')
  .get(getDriverById)
  .put(updateDriver)
  .delete(deleteDriver);

module.exports = router;