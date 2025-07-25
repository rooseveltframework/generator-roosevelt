(async () => {
  await require('roosevelt')({
    onBeforeMiddleware: (app) => {
      // this defines a model used on all static pages, unless overridden by a page-specific model
      app.get('htmlModels')['*'] = {
        global: {
          hello: 'And I\'m a variable trickling down through the global model!'
        }
      }
    }
  }).init()
})()
