module.exports = (router, app) => {
  router.route('/api/global').post(async (req, res) => res.json(await require('models/global')(req, res)))
  router.route('/api/homepage').post(async (req, res) => res.json(await require('models/homepage')(req, res)))
  router.route('/api/getRandomNumber').post(async (req, res) => res.json(await require('models/getRandomNumber')(req, res)))
}
