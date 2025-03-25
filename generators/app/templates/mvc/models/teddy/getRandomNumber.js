module.exports = async function (req, res) {
  const model = await require('models/global')(req, res)
  model.randomNumber = Math.floor(Math.random() * 10) + 1
  return model
}
