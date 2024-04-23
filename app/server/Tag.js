const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: String,
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;