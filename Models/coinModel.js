const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["bitcoin", "ethereum", "matic"],
    required:true,
    index:true
  },
  price: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  change24h: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true 
  }
});

//setting index for name in ascending and for timestamps in descending for fast retrieval of data
coinSchema.index({coin:1,timestamp:-1});

module.exports = mongoose.model("coinModel",coinSchema)