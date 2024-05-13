if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const app = express();
const noticiasRoutes = require('./routes/noticias')
const userRoutes = require('./routes/users')
const session = require('express-session')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const Noticia = require('./models/noticia');
const MongoDBStore = require('connect-mongo')(session);

const dbUrl = 'mongodb://localhost:27017/ipv'

app.listen(3000, () => {
    console.log('listening to port 3000')
})

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});


app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')))
app.use(mongoSanitize())
app.use(helmet({ contentSecurityPolicy: false }))

const store = new MongoDBStore({
    url: dbUrl,
    secret: 'thisshouldbeabettersecret!',
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/conf', userRoutes)
app.use('/noticias', noticiasRoutes)

app.get('/', async (req, res) => {
    const noticias = await Noticia.find({})
    res.render('home/index', { noticias })
})
app.get('/contacto', (req, res) => {
    res.render('contacto/index')
})
app.get('/institucional/mision', (req, res) => {
    res.render('institucional/mision')
})
app.get('/institucional/autoridades', (req, res) => {
    res.render('institucional/autoridades')
})
app.get('/institucional/organigrama', (req, res) => {
    res.render('institucional/organigrama')
})
app.get('/tramites/requisitos', (req, res) => {
    res.render('tramites/requisitos')
})
app.get('/tramites/transferencia', (req, res) => {
    res.render('tramites/transferencia')
})



app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("errors/error.ejs", { err })
});