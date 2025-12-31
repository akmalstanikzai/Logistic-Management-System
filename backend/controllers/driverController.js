const Driver = require('../models/Driver');
const Shipment = require('../models/Shipment');

// @desc    Create a new driver
// @route   POST /api/drivers
// @access  Public
exports.createDriver = async (req, res, next) => {
  try {
    const { name, email, phone, licenseNumber, vehicleType } = req.body;

    // Check if driver with email or license already exists
    const existingDriver = await Driver.findOne({
      $or: [{ email }, { licenseNumber }]
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this email or license number already exists'
      });
    }

    const driver = await Driver.create({
      name,
      email,
      phone,
      licenseNumber,
      vehicleType
    });

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res. status(400).json({
        success: false,
        message:  'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
exports.getAllDrivers = async (req, res, next) => {
  try {
    const { isAvailable, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    const drivers = await Driver.find(filter)
      .populate('currentShipment', 'shipmentId shipmentName status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Driver.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: drivers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: drivers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single driver by ID
// @route   GET /api/drivers/:id
// @access  Public
exports.getDriverById = async (req, res, next) => {
  try {
    const driver = await Driver. findById(req.params.id)
      .populate('currentShipment');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    next(error);
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Public
exports.updateDriver = async (req, res, next) => {
  try {
    const { name, email, phone, licenseNumber, vehicleType, isAvailable } = req.body;

    const driver = await Driver.findById(req.params. id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check for duplicate email or license (excluding current driver)
    if (email || licenseNumber) {
      const duplicate = await Driver.findOne({
        _id: { $ne: req.params.id },
        $or: [
          email ?  { email } : {},
          licenseNumber ? { licenseNumber } : {}
        ]
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Email or license number already in use'
        });
      }
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, licenseNumber, vehicleType, isAvailable },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: updatedDriver
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object. values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Public
exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check if driver is assigned to any shipment
    if (driver.currentShipment) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete driver assigned to a shipment.  Please reassign first.'
      });
    }

    await driver.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available drivers
// @route   GET /api/drivers/available
// @access  Public
exports.getAvailableDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find({ isAvailable: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    next(error);
  }
};