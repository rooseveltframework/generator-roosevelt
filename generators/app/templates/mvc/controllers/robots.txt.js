const path = require('path')

module.exports = function (app) {
  app.route('/robots.txt').get(function (req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.sendFile(path.join(app.get('viewsPath'), 'robots.txt'))
  })
}
