module.exports = (router, app) => {
  router.route('/pageWithForm').get(async (req, res) => {
    const model = await require('models/global')(req, res)
    model.content.pageTitle = 'Page with form'
    res.render('pageWithForm', model)
  })

  router.route('/pageWithForm').post(async (req, res) => {
    console.log('req.body:', req.body)
    let model = await require('models/global')(req, res)
    model.content.pageTitle = 'Page with form'
    model = { ...model, ...req.body }
    res.render('pageWithForm', model)
  })
}
