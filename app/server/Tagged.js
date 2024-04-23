const mongoose = require('mongoose');

const taggedSchema = new mongoose.Schema({
    // Define your schema fields here
    file_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
    tag_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    },
    value: {
        type: String,
        default: ''
    }
});
taggedSchema.index({ file_id: 1, tag_id: 1 }, { unique: true });

const Tagged = mongoose.model('Tagged', taggedSchema, 'tagged');

module.exports = Tagged;