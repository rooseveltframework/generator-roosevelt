module.exports = (router, app) => {
  router.route('/secondPage').get(async (req, res) => {
    const model = await require('models/global')(req, res)
    model.content.pageTitle = 'Second page'
    model.variable = 'variable with contents: "hi there!"'
    res.render('secondPage', model)
  })
}
