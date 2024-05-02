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
    content_type: {
        type: String,
        default: 'text/plain'
    },
    lastVerified: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('UserSource', UserSource)