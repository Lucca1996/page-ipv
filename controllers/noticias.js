const Noticia = require('../models/noticia');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const noticias = await Noticia.find({})
    res.render('noticias/index', { noticias })
}

module.exports.renderNewForm = (req, res) => {
    res.render('noticias/new')
}

module.exports.createNoticia = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.noticia.location,
        limit: 1
    }).send()
    const noticia = new Noticia(req.body.noticia);
    noticia.geometry = geoData.body.features[0].geometry;
    noticia.coverimage = req.files.coverimage.map(f => ({ url: f.path, filename: f.filename }));
    noticia.images = req.files.image.map(f => ({ url: f.path, filename: f.filename }));
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
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.noticia.location,
            limit: 1,
        })
        .send();
    const noticia = await Noticia.findByIdAndUpdate(id, { ...req.body.noticia });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    noticia.images.push(...imgs);
    noticia.geometry = geoData.body.features[0].geometry;
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await noticia.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await noticia.save()
    req.flash('success', 'Noticia editada correctamente!')
    res.redirect(`/noticias/${noticia._id}`)
}

module.exports.deleteNoticia = async (req, res) => {
    const { id } = req.params;
    await Noticia.findByIdAndDelete(id);
    req.flash('success', 'Noticia eliminada correctamente!')
    res.redirect('/noticias');
}