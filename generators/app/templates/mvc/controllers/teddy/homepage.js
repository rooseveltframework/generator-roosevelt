module.exports = (router, app) => {
  router.route('/').get(async (req, res) => {
    const model = await require('models/homepage')(req, res)
    model.content.pageTitle = 'Homepage'
    res.render('homepage', model)
  })
}
