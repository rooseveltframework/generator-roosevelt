const path = require('path')

module.exports = function (app) {
  app.route('/').get((req, res) => {
    res.sendFile(path.join(app.get('viewsPath'), 'homepage.html'))
  })
}
