const mongoose = require('mongoose');


const sourcesSchema = new mongoose.Schema({
    name:String,
    source_id:String,
});

module.exports = mongoose.model('Sources', sourcesSchema);