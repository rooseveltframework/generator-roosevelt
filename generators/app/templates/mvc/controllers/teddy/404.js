module.exports = (router, app) => {
  router.route('*all').all(async (req, res) => {
    const model = await require('models/server')(req, res)
    model.content.pageTitle = 'Not Found'
    res.status(404)
    res.render('404', model)
  })
}
