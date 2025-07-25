module.exports = () => {
  const model = require('models/global')()
  model.content.hello = 'Hi! I\'m a variable trickling down through the page\'s model!'
  model.content.picLabel = 'Here\'s a silly picture of Teddy Roosevelt:'
  model.teddyPath = '/images/teddy.jpg'
  model.content.pageTitle = 'Homepage'
  return model
}
