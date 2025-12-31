const Shipment = require('../models/Shipment');
const Driver = require('../models/Driver');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Public
exports.createShipment = async (req, res, next) => {
  try {
    const { shipmentName, origin, destination, weight, description, driver } = req.body;

    const shipmentData = {
      shipmentName,
      origin,
      destination,
      weight,
      description
    };

    // If driver is assigned during creation
    if (driver) {
      const driverDoc = await Driver.findById(driver);
      
      if (!driverDoc) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found'
        });
      }

      if (! driverDoc.isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Driver is not available'
        });
      }

      shipmentData.driver = driver;
    }

    const shipment = await Shipment.create(shipmentData);

    // Update driver if assigned
    if (driver) {
      await Driver.findByIdAndUpdate(driver, {
        currentShipment: shipment._id,
        isAvailable: false
      });
    }

    const populatedShipment = await Shipment.findById(shipment._id)
      .populate('driver', 'name email phone licenseNumber vehicleType');

    res.status(201).json({
      success: true,
      message: 'Shipment created successfully',
      data: populatedShipment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res. status(400).json({
        success: false,
        message:  'Validation Error',
        errors: Object.values(error. errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Public
exports. getAllShipments = async (req, res, next) => {
  try {
    const { status, driver, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (driver) filter.driver = driver;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const shipments = await Shipment.find(filter)
      .populate('driver', 'name email phone licenseNumber vehicleType')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Shipment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: shipments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: shipments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single shipment by ID
// @route   GET /api/shipments/:id
// @access  Public
exports. getShipmentById = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('driver', 'name email phone licenseNumber vehicleType');

    if (!shipment) {
      return res. status(404).json({
        success: false,
        message:  'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }
    next(error);
  }
};

// @desc    Update shipment status
// @route   PATCH /api/shipments/:id/status
// @access  Public
exports.updateShipmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['Pending', 'In Transit', 'Delivered'];
    if (!validStatuses. includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status.  Must be:  Pending, In Transit, or Delivered'
      });
    }

    const shipment = await Shipment.findById(req. params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Validate status flow
    const currentStatus = shipment.status;
    const statusFlow = {
      'Pending': ['In Transit'],
      'In Transit': ['Delivered'],
      'Delivered':  []
    };

    if (currentStatus === status) {
      return res.status(400).json({
        success: false,
        message: `Shipment is already ${status}`
      });
    }

    if (! statusFlow[currentStatus]. includes(status) && currentStatus !== status) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}.  Valid next status: ${statusFlow[currentStatus]. join(', ') || 'None (already at final state)'}`
      });
    }

    // Update status
    shipment.status = status;
    
    // Add to status history
    shipment.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: 'Admin' // You can replace this with actual user info
    });

    // If delivered, update deliveredAt and free the driver
    if (status === 'Delivered') {
      shipment.deliveredAt = new Date();
      
      if (shipment.driver) {
        await Driver.findByIdAndUpdate(shipment.driver, {
          isAvailable: true,
          currentShipment: null
        });
      }
    }

    await shipment.save();

    const updatedShipment = await Shipment.findById(shipment._id)
      .populate('driver', 'name email phone licenseNumber vehicleType');

    res.status(200).json({
      success: true,
      message: 'Shipment status updated successfully',
      data:  updatedShipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign driver to shipment
// @route   PATCH /api/shipments/:id/assign-driver
// @access  Public
exports.assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: 'Driver ID is required'
      });
    }

    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    if (shipment.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot assign driver to delivered shipment'
      });
    }

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res. status(404).json({
        success: false,
        message:  'Driver not found'
      });
    }

    if (! driver.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Driver is not available'
      });
    }

    // If there was a previous driver, make them available
    if (shipment.driver) {
      await Driver.findByIdAndUpdate(shipment. driver, {
        isAvailable: true,
        currentShipment: null
      });
    }

    // Assign new driver
    shipment.driver = driverId;
    await shipment.save();

    // Update driver
    await Driver.findByIdAndUpdate(driverId, {
      currentShipment: shipment._id,
      isAvailable: false
    });

    const updatedShipment = await Shipment.findById(shipment._id)
      .populate('driver', 'name email phone licenseNumber vehicleType');

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      data: updatedShipment
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    next(error);
  }
};

// @desc    Update shipment details
// @route   PUT /api/shipments/:id
// @access  Public
exports. updateShipment = async (req, res, next) => {
  try {
    const { shipmentName, origin, destination, weight, description } = req.body;

    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    if (shipment.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update delivered shipment'
      });
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { shipmentName, origin, destination, weight, description },
      { new: true, runValidators: true }
    ).populate('driver', 'name email phone licenseNumber vehicleType');

    res.status(200).json({
      success: true,
      message: 'Shipment updated successfully',
      data:  updatedShipment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
// @access  Public
exports.deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res. status(404).json({
        success: false,
        message:  'Shipment not found'
      });
    }

    // Free the driver if assigned
    if (shipment.driver) {
      await Driver.findByIdAndUpdate(shipment.driver, {
        isAvailable: true,
        currentShipment: null
      });
    }

    await shipment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/shipments/dashboard/metrics
// @access  Public
exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const deliveredShipments = await Shipment. countDocuments({ status: 'Delivered' });
    const inTransitShipments = await Shipment.countDocuments({ status: 'In Transit' });
    const pendingShipments = await Shipment.countDocuments({ status: 'Pending' });

    const totalDrivers = await Driver.countDocuments();
    const availableDrivers = await Driver.countDocuments({ isAvailable: true });
    const busyDrivers = await Driver.countDocuments({ isAvailable: false });

    // Recent shipments
    const recentShipments = await Shipment. find()
      .populate('driver', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Status breakdown
    const statusBreakdown = [
      { status: 'Pending', count: pendingShipments },
      { status: 'In Transit', count: inTransitShipments },
      { status: 'Delivered', count: deliveredShipments }
    ];

    res.status(200).json({
      success: true,
      data: {
        shipments: {
          total: totalShipments,
          delivered: deliveredShipments,
          inTransit: inTransitShipments,
          pending: pendingShipments,
          statusBreakdown
        },
        drivers: {
          total: totalDrivers,
          available: availableDrivers,
          busy: busyDrivers
        },
        recentShipments
      }
    });
  } catch (error) {
    next(error);
  }
};