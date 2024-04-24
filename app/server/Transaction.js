const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file_id: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
  timeStamp: {
    type: Date,
    default: Date.now
  },
  up: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);