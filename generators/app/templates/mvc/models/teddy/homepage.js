module.exports = async (req, res) => {
  const model = await require('models/global')(req, res)
  model.content.hello = 'Hi! I\'m a variable trickling down through the MVC structure!'
  model.content.picLabel = 'Here\'s a silly picture of Teddy Roosevelt:'
  model.teddyPath = '/images/teddy.jpg'
  return model
}
