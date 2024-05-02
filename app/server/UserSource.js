const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSource = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file_id: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
  link: {
    type: String,
    required: true
  },
  lastVerified: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserSource', UserSource)