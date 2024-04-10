const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const app = express();
const Noticia = require('./models/noticia');
const Joi = require('joi');
const { noticiaSchema } = require('./schemas.js')

app.listen(3000, () => {
    console.log('listening to port 3000')
})

mongoose.connect('mongodb://localhost:27017/ipv')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});


app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const validateNoticia = (req, res, next) => {

    const { error } = noticiaSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/noticias', catchAsync(async (req, res) => {
    const noticias = await Noticia.find({})
    res.render('noticias/index', { noticias })
}))

app.get('/noticias/new', (req, res) => {
    res.render('noticias/new')
})

app.post('/noticias', validateNoticia, catchAsync(async (req, res, next) => {
    // if (!req.body.noticia) throw new ExpressError('Noticia invalida o incompleta', 400)
    const noticia = new Noticia(req.body.noticia);
    await noticia.save();
    res.redirect(`/noticias/${noticia._id}`)
}))

app.get('/noticias/:id', catchAsync(async (req, res) => {
    const noticia = await Noticia.findById(req.params.id)
    res.render('noticias/show', { noticia })
}))

app.get('/noticias/:id/edit', catchAsync(async (req, res) => {
    const noticia = await Noticia.findById(req.params.id)
    res.render('noticias/edit', { noticia })
}))

app.put('/noticias/:id', validateNoticia, catchAsync(async (req, res) => {
    const { id } = req.params;
    const noticia = await Noticia.findByIdAndUpdate(id, { ...req.body.noticia });
    res.redirect(`/noticias/${noticia._id}`)
}));

app.delete('/noticias/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Noticia.findByIdAndDelete(id);
    res.redirect('/noticias');
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("./errors/error", { err })
});