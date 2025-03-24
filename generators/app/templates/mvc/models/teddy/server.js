module.exports = async (req, res) => {
  const model = await require('models/global')(req, res)
  model.server = {
    NODE_ENV: process.env.NODE_ENV,
    appVersion: req.app.get('package').version,
    currentYear: new Date().getFullYear(),
    mainDomain: req.headers['x-forwarded-host'] || req.headers.host,
    host: req.hostname,
    url: req.url,
    debugMarkup: req.app.get('debugMarkup')
  }
  return model
}
