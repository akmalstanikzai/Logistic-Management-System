const express = require('express');
const router = express.Router();
const {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipmentStatus,
  assignDriver,
  updateShipment,
  deleteShipment,
  getDashboardMetrics
} = require('../controllers/shipmentController');

// Dashboard metrics (must be before /:id to avoid route conflict)
router.get('/dashboard/metrics', getDashboardMetrics);

// Main CRUD routes
router.route('/')
  .post(createShipment)
  .get(getAllShipments);

router.route('/:id')
  .get(getShipmentById)
  .put(updateShipment)
  .delete(deleteShipment);

// Specific actions
router.patch('/:id/status', updateShipmentStatus);
router.patch('/:id/assign-driver', assignDriver);

module.exports = router;