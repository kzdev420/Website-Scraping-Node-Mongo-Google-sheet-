const mongoose = require('mongoose');


const newsSchema = new mongoose.Schema({
    title: { type: String, index: true, unique: true },
    image: String,
    keywords: String,
    content: String,
    date: Date,
    url: String,
    source_name: String,
    source_id: String,
    author_id: String,
    author_hooty_id: Number,
    author_name: String,
    scraped: { type: Boolean, default: false },
    author_email_scraped: { type: Boolean, default: false },
    genre: String,
    email: String,
    dateDBAdded:Date
});

newsSchema.index({ title: 'text', content: 'text', keywords: 'text', author_name: 'text' });


module.exports = mongoose.model('News', newsSchema);