const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  name: String,
  path: String,
  plays: Number
});

module.exports = mongoose.model('Song', songSchema);
