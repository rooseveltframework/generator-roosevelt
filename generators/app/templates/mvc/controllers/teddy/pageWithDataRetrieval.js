module.exports = (router, app) => {
  router.route('/pageWithDataRetrieval').get(async (req, res) => {
    const model = await require('models/getRandomNumber')()
    model.content.pageTitle = 'Page with data retrieval'
    res.render('pageWithDataRetrieval', model)
  })
}
