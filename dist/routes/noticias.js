"use strict";

var express = require('express');
var router = express.Router();
var noticias = require('../controllers/noticias');
var catchAsync = require('../utils/catchAsync');
var _require = require('../middleware'),
  isLoggedIn = _require.isLoggedIn,
  isAuthor = _require.isAuthor,
  validateNoticia = _require.validateNoticia;
var multer = require('multer');
var _require2 = require('../cloudinary'),
  storage = _require2.storage;
var upload = multer({
  storage: storage
});
router.route('/').get(catchAsync(noticias.index)).post(isLoggedIn, upload.fields([{
  name: 'coverimage',
  maxCount: 1
}, {
  name: 'image',
  maxCount: 30
}]), validateNoticia, catchAsync(noticias.createNoticia));
router.get('/new', isLoggedIn, noticias.renderNewForm);
router.route('/:id').get(catchAsync(noticias.showNoticia)).put(isLoggedIn, isAuthor, upload.array('image'), validateNoticia, catchAsync(noticias.editNoticia))["delete"](isLoggedIn, isAuthor, catchAsync(noticias.deleteNoticia));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(noticias.editForm));
module.exports = router;