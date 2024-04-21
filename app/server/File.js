const mongoose = require("mongoose");
const FileSchema = new mongoose.Schema({
    file_name: String,
    file_size: Number,
    timestamp: { type: Date, default: Date.now },
    data: Buffer,
    uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const File = mongoose.model("File", FileSchema);

module.exports = File;