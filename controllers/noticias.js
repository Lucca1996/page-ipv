const Noticia = require('../models/noticia');

module.exports.index = async (req, res) => {
    const noticias = await Noticia.find({})
    res.render('noticias/index', { noticias })
}

module.exports.renderNewForm = (req, res) => {
    res.render('noticias/new')
}

module.exports.createNoticia = async (req, res, next) => {
    // if (!req.body.noticia) throw new ExpressError('Noticia invalida o incompleta', 400)
    const noticia = new Noticia(req.body.noticia);
    noticia.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    noticia.author = req.user._id
    await noticia.save();
    req.flash('success', 'Noticia creada correctamente!')
    res.redirect(`/noticias/${noticia._id}`)
}

module.exports.showNoticia = async (req, res) => {
    var Id_error = 0
    var noticia
    try {
        noticia = await Noticia.findById(req.params.id).populate('author');
    } catch (err) {
        if (err.kind === 'ObjectId') Id_error = 1
    }
    if (!noticia || Id_error == 1) {
        req.flash('error', 'No pudimos encontrar la noticia solicitada');
        return res.redirect('/noticias');
    }
    res.render('noticias/show', { noticia })
}

module.exports.editForm = async (req, res) => {
    var Id_error = 0
    var noticia
    try {
        noticia = await Noticia.findById(req.params.id)
    } catch (err) {
        if (err.kind === 'ObjectId') Id_error = 1
    }
    if (!noticia || Id_error == 1) {
        req.flash('error', 'No pudimos encontrar la noticia solicitada');
        return res.redirect('/noticias');
    }
    res.render('noticias/edit', { noticia })
}

module.exports.editNoticia = async (req, res) => {
    const { id } = req.params;
    const noticia = await Noticia.findByIdAndUpdate(id, { ...req.body.noticia });
    req.flash('success', 'Noticia editada correctamente!')
    res.redirect(`/noticias/${noticia._id}`)
}

module.exports.deleteNoticia = async (req, res) => {
    const { id } = req.params;
    await Noticia.findByIdAndDelete(id);
    req.flash('success', 'Noticia eliminada correctamente!')
    res.redirect('/noticias');
}