const teddy = require('teddy')

module.exports = (router, app) => {
  router.route('/pageWithForm').all((req, res) => {
    let model

    if (router.server) {
      model = router.isoRequire('models/global')(req, res)
      if (router.serverSideRender(req)) {
        model.frontendModel = JSON.stringify(model)
      }
      if (req.body) { // do things you only need to do if it's a form submission
        model.formData = req.body // send the submitted form data to the template
      }
      render()
    }

    if (router.client) {
      model = window.model
      if (!model) {
        res.render('loadingPage', model)
        router.apiFetch('/pageWithForm', (data) => {
          model = window.model = data
          render()
        })
      } else {
        render()
      }
    }

    function render () {
      model.content.pageTitle = 'Page with a form'
      router.apiRender(req, res, model) || res.render('pageWithForm', model)

      if (router.client) {
        // do any post-render client-side stuff here (e.g. DOM manipulation)

        // listen for form submit using convenient onSubmit function defined by roosevelt-router
        //
        // you can define your own DOM events however you like, but router.onSubmit gives you
        // some stuff for free, such as preventing the page reload when the form is submitted,
        // automatically sending a fetch to the server with the form data, automatically
        // detecting if the response is JSON or text, and giving you an easy callback interface
        // to handle the response with minimal boilerplate
        router.onSubmit((e, data) => {
          // update the page when the form submit returns a data response
          // renders a new template and replaces the whole page with the new markup
          // the updatePage convenience method also updates the page title with the title from the new full page markup
          // can also render partials too if you suppply a target element container to dump the new markup into as the second argument
          router.updatePage(teddy.render('formResultsPage', data))
        })
      }
    }
  })
}
