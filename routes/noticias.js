const express = require('express')
const router = express.Router()
const noticias = require('../controllers/noticias')
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateNoticia } = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(noticias.index))
    .post(isLoggedIn, upload.array('image'), validateNoticia, catchAsync(noticias.createNoticia))

router.get('/new', isLoggedIn, noticias.renderNewForm)

router.route('/:id')
    .get(catchAsync(noticias.showNoticia))
    .put(isLoggedIn, isAuthor, validateNoticia, catchAsync(noticias.editNoticia))
    .delete(isLoggedIn, isAuthor, catchAsync(noticias.deleteNoticia))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(noticias.editForm))

module.exports = router