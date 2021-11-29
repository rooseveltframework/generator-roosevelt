module.exports = (router, app) => {
  router.route('/otherPage').get((req, res) => {
    let model

    if (router.server) {
      model = router.isoRequire('models/global')(req, res)
      if (router.serverSideRender(req)) {
        model.frontendModel = JSON.stringify(model)
      }
      render()
    }

    if (router.client) {
      model = window.model
      if (!model) {
        res.render('loadingPage', model)
        router.apiFetch('/otherPage', (data) => {
          model = window.model = data
          render()
        })
      } else {
        render()
      }
    }

    function render () {
      model.content.pageTitle = 'Some other page'
      router.apiRender(req, res, model) || res.render('otherPage', model)
      if (router.client) {
        // do any post-render client-side stuff here (e.g. DOM manipulation)
      }
    }
  })
}
