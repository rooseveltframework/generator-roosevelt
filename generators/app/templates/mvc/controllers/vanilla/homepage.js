const path = require('path')

module.exports = function (app) {
  const file = path.join(app.get('viewsPath'), 'homepage.html')

  app.route('/').get((req, res) => {
    res.sendFile(file)
  })
}
