module.exports = (req, res) => {
  return {
    currentYear: new Date().getFullYear(),
    mainDomain: req.headers['x-forwarded-host'] || req.headers.host,
    NODE_ENV: process.env.NODE_ENV
  }
}
