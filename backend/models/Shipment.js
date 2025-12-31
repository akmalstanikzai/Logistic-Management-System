const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema(
  {
    shipmentName: {
      type: String,
      required: [true, 'Shipment name is required'],
      trim: true,
      minlength: [3, 'Shipment name must be at least 3 characters'],
      maxlength: [200, 'Shipment name cannot exceed 200 characters']
    },
    shipmentId: {
      type:  String,
      unique: true,
      uppercase: true,
      trim: true
    },
    driver: {
      type: mongoose. Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    status: {
      type: String,
      enum: ['Pending', 'In Transit', 'Delivered'],
      default: 'Pending'
    },
    origin: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['Pending', 'In Transit', 'Delivered']
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        updatedBy: {
          type: String,
          default: 'System'
        }
      }
    ],
    deliveredAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to generate shipment ID
shipmentSchema.pre('save', async function (next) {
  if (!this.shipmentId) {
    const count = await mongoose.model('Shipment').countDocuments();
    this.shipmentId = `SHP${String(count + 1).padStart(6, '0')}`;
  }
  
  // Initialize status history
  if (this.isNew) {
    this.statusHistory = [{
      status: this.status,
      timestamp: new Date(),
      updatedBy: 'System'
    }];
  }
  
  next();
});

// Index for faster queries
shipmentSchema.index({ shipmentId: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ driver: 1 });

module.exports = mongoose.model('Shipment', shipmentSchema);