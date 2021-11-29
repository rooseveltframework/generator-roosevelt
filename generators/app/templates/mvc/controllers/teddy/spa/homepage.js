module.exports = (router, app) => {
  router.route('/').get((req, res) => {
    let model

    // do any pre-render server-side stuff here
    if (router.server) {
      // populate the model with database queries and other transformations that are exclusive to the server
      // isoRequire allows you to require a file only on the server; it will always return false on the client
      // this makes it possible to share this file with frontend module bundlers without server-exclusive files
      // being included in your bundle
      model = router.isoRequire('models/global')(req, res) // get some data common to all pages
      model = router.isoRequire('models/homepage')(model) // get some data specific to this page

      // do things you only need to do if it's a server-side render (when serving HTML from the server, not JSON)
      if (router.serverSideRender(req)) {
        // package up a version of the model to dump into the layout template for frontend consumption
        model.frontendModel = JSON.stringify(model)
      }

      render() // call the common render method for both server and client
    }

    // do any pre-render client-side stuff here
    if (router.client) {
      // inherit model from what's defined in the layout template before this JS loads on the client
      model = window.model

      // check if model is undefined for some reason or if any important data is missing
      // this can happen during certain page transitions depending on how state is maintained
      if (!model || !model.teddyPath) { // fetch missing data if any of these sanity checks fail
        res.render('loadingPage', model) // show spinner while waiting for the API fetch
        router.apiFetch('/', (data) => {
          model = window.model = data // set the model to the data we got back from the server
          render() // call the common render method for both server and client
        })
      } else { // no data missing
        render() // call the common render method for both server and client
      }
    }

    // common render method for both server and client
    function render () {
      // do any pre-render stuff common to both the backend and frontend here before calling the render method
      model.content.pageTitle = 'Homepage'

      // if it's an API request (as defined by a request with content-type: 'application/json'), then it will send JSON data
      // if not, it will render HTML
      router.apiRender(req, res, model) || res.render('homepage', model)

      if (router.client) {
        // do any post-render client-side stuff here (e.g. DOM manipulation)
      }
    }
  })
}
