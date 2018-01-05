const path = require('path')

module.exports = function (app) {
  const file = path.join(app.get('viewsPath'), 'robots.txt')

  app.route('/robots.txt').get((req, res) => {
    res.setHeader('Content-Type', 'text/plain')
    res.sendFile(file)
  })
}
