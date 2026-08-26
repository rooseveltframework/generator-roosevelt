// this file starts a development server that rebuilds the site as you edit it

// pass Roosevelt's `--build` flag to write the site out without serving it, which is what `npm run build` and `npm run build-dev` do in development mode Roosevelt rebuilds the pages you edit and reloads the browser itself
;(async () => {
  await require('roosevelt')({
    onBeforeMiddleware: (app) => {
      // this defines a model used on all static pages, unless overridden by a page-specific model
      app.get('htmlModels')['*'] = {
        global: {
          hello: 'And I\'m a variable trickling down through the global model!'
        }
      }
    }
  }).startServer()
})()
