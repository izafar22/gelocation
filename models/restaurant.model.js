const mongoose = require('mongoose');
const restaurantSchema = mongoose.Schema(
 {
  id: Number,
  restaurant_name: String,
  phone: Number,
  address: String,
  location: {
   type: { type: String },
   coordinates: [Number],
  },
 },
 {
  timestamps: true
 }
)

module.exports = mongoose.model('Restaurant', restaurantSchema);