const path = require('path')

module.exports = (router, app) => {
  const file = path.join(app.get('viewsPath'), 'homepage.html')

  router.route('/').get((req, res) => {
    res.sendFile(file)
  })
}
