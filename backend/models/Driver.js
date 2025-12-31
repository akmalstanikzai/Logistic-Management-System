const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    licenseNumber: {
      type:  String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    vehicleType: {
      type:  String,
      enum: ['truck', 'van', 'bike', 'car'],
      default: 'van'
    },
    currentShipment: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'Shipment',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
driverSchema.index({ email: 1 });
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Driver', driverSchema);