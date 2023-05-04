// replace no-js class with js class which allows us to write css that targets non-js or js enabled users separately
document.body.classList.replace('no-js', 'js')

// require and configure roosevelt-router
const router = require('roosevelt/lib/roosevelt-router')({

  // your templating system (required)
  templatingSystem: require('teddy'),

  // your templates (required)
  templateBundle: require('views'),

  // supply a function to be called immediately when roosevelt-router's constructor is invoked
  // you can leave this undefined if you're using teddy and you don't want to customize the default SPA rendering behavior
  // required if not using teddy, optional if using teddy
  onLoad: null,

  // define a res.render(template, model) function to render your templates
  // you can leave this undefined if you're using teddy and you don't want to customize the default SPA rendering behavior
  // required if not using teddy, optional if using teddy
  renderMethod: null
})

// load all isomorphic controllers
// leverages isomorphicControllers roosevelt feature
require('controllers')(router)

router.init() // activate router
