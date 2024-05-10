"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ImageSchema = new Schema({
  url: String,
  filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});
var opts = {
  toJSON: {
    virtuals: true
  }
};
var NoticiaSchema = new Schema({
  title: String,
  videos: String,
  images: [ImageSchema],
  coverimage: [ImageSchema],
  geometry: {
    type: {
      type: String,
      "enum": ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  content: String,
  subtitle: String,
  category: String,
  date: Date,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, opts);
NoticiaSchema.virtual('properties.popUpMarkup').get(function () {
  return "<strong><a href=\"/noticias/".concat(this._id, "\" >").concat(this.title, "</a></strong>\n    <p>").concat(this.content.substring(0, 25), "...</p>");
});
module.exports = mongoose.model('Noticia', NoticiaSchema);