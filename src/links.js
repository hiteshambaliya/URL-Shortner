const mongoose = require('mongoose')

// instantiate a mongoose schema
const LinkSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    clicks: Number,
    date: {
        type: String,
        default: Date.now
    }
})

// create a model from schema and export it
module.exports = mongoose.model('short_links', LinkSchema)