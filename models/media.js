const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    user: {type: String, reuired: true},
    upc: {type: String}, //required: true, unique: true},
    title: { type: String, required: true },
    creator_name: String,
    creator_type: String,
    cover_img: String,
    cover_alt: String,
    format: {type: String, required: true},
    location: String,
    tags:[String],
    desc: String
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;