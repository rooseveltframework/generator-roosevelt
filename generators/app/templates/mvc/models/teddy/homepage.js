module.exports = (model) => {
  model.content.hello = 'HTTPS CHANGES'
  model.content.picLabel = 'Here\'s a silly picture of Teddy Roosevelt:'
  model.teddyPath = '/images/teddy.jpg'
  return model
}
