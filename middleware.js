const { noticiaSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Noticia = require('./models/noticia');


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Usted no esta autorizado para realizar esa accion');
        return res.redirect('/noticias');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const noticia = await Noticia.findById(id);
    if (!noticia.author.equals(req.user._id)) {
        req.flash('error', 'Usted no esta autorizado para realizar esa accion');
        return res.redirect(`/noticias/${id}`);
    }
    next();
}

module.exports.validateNoticia = (req, res, next) => {

    const { error } = noticiaSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}