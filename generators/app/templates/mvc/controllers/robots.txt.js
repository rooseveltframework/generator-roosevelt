const fs = require('fs')

module.exports = function (app) {
  app.route('/robots.txt').get(function (req, res) {
    res.setHeader('Content-Type', 'text/plain')

    // it's plain text, so we don't want to render it with the template parser
    fs.readFile(app.get('viewsPath') + 'robots.txt', 'utf8', function (err, data) {
      if (err) {
        console.error(err)
      }
      res.send(data)
    })
  })
}
