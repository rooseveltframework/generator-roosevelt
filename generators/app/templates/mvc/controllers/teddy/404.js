module.exports = (router, app) => {
  router.route('*').all((req, res) => {
    const model = require('models/global')(req, res)
    model.content.pageTitle = '{content.appTitle} - 404 not found'
    model.host = req.hostname
    model.url = req.url
    model.appVersion = app.get('package').version
    res.status(404)
    res.render('404', model)
  })
}
