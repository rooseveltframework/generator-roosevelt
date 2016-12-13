module.exports = function(app) {
  app.route('/').get(function(req, res) {
    var model = require('models/global')(req, res);
    model.content.pageTitle = '{content.appTitle} - Homepage';
    model.content.hello = 'Hi! I\'m a variable trickling down through the MVC structure!';
    model.content.picLabel = 'Here\'s a silly picture of Teddy Roosevelt:';
    model.teddyPath = '/images/teddy.jpg';
    res.render('homepage', model);
  });
};