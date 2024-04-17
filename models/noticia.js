const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoticiaSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    content: String,
    date: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Noticia', NoticiaSchema);