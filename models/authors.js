const mongoose = require('mongoose');


const authorSchema = new mongoose.Schema({
    name: String,
    email: String,
    source_name: String,
    source_id: String,
    scrapped: { type: Boolean, default: false },
});

module.exports = mongoose.model('Author', authorSchema);