const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoticiaSchema = new Schema({
    title: String,
    image: String,
    content: String,
    date: String,
    location: String
});

module.exports = mongoose.model('Noticia', NoticiaSchema);