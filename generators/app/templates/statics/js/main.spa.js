// this will stop the JS from executing if CSS is disabled or a CSS file fails to load; it will also remove any existing CSS from the DOM
require('check-if-css-is-disabled')()
window.addEventListener('cssDisabled', (event) => {
  // undo any DOM manipulations and then stop any further JS from executing
  document.body.classList.replace('js', 'no-js')
  throw new Error('A CSS file failed to load at some point during the app\'s usage. It is unsafe to execute any further JavaScript if the CSS has not loaded properly.')
})

// replace no-js class with js class which allows us to write css that targets non-js or js enabled users separately
document.body.classList.replace('no-js', 'js')

// load semantic-forms UI library
require('semantic-forms')()

// load single page express, the teddy templating system, and the templates
const singlePageExpress = require('single-page-express')
const teddy = require('teddy/client')
const templates = require('views')

// register the templates with the teddy templating system
Object.entries(templates).forEach(([name, template]) => teddy.setTemplate(name, template))

// start single-page-express
const app = singlePageExpress({
  templatingEngine: teddy,
  templates,

  // which DOM elements will be updated by default when routes are triggered
  defaultTargets: [
    'body > main > article',
    'body > main > header > h2'
  ],

  // tailor animations based on which page is being visited and handle animations using css animations if view transitions are not supported
  beforeEveryRender: (params) => {
    // if the last visited page is the current page, do a fade animation, not a slide
    if (!params.targets.includes('body > main > article') || !params.doc.querySelector('body > main > article') || params.doc.querySelector('body > main > article').id === window.lastPageId) {
      document.querySelector('html').classList.add('fade')
    } else {
      document.querySelector('html').classList.remove('fade')
    }

    // handle browsers without view transitions support
    if (!document.startViewTransition) {
      // hide horizontal scrollbar for non-view transitions browsers during animations
      window.oldBodyOverflow = window.getComputedStyle(document.body).overflow // store original value of the body tag's overflow css property
      document.body.style.overflow = 'hidden'

      // if the last visited page is the current page, do a fade animation, not a slide
      if (!params.targets.includes('body > main > article') || !params.doc.querySelector('body > main > article') || params.doc.querySelector('body > main > article').id === window.lastPageId) {
        document.querySelector('body > main > header > h2').style.animation = 'var(--fade-out)'
        document.querySelector('body > main > article').style.animation = 'var(--fade-out)'
      } else {
        // handle the default animations
        if (!document.querySelector('html.backButtonPressed')) { // when the back button was not pressed
          document.querySelector('body > main > header > h2').style.animation = 'var(--fade-out), var(--slide-to-left)'
          document.querySelector('body > main > article').style.animation = 'var(--fade-out), var(--slide-to-left)'
        } else { // when the back button was pressed, reverse the animation direction
          document.querySelector('body > main > header > h2').style.animation = 'var(--fade-out), var(--slide-to-right)'
          document.querySelector('body > main > article').style.animation = 'var(--fade-out), var(--slide-to-right)'
        }
      }
    }
  },

  // delay is only needed for css animations; not for view transitions
  updateDelay: !document.startViewTransition ? 90 : 0,

  afterEveryRender: (params) => {
    // if the last visited page is the current page, do a fade animation, not a slide
    if (!params.targets.includes('body > main > article') || !params.doc.querySelector('body > main > article') || params.doc.querySelector('body > main > article').id === window.lastPageId) {
      document.querySelector('body > main > header > h2').style.animation = 'var(--fade-in)'
      document.querySelector('body > main > article').style.animation = 'var(--fade-in)'
    }

    // handle browsers without view transitions support
    if (!document.startViewTransition) {
      if (params.doc.querySelector('body > main > article') && params.doc.querySelector('body > main > article').id !== window.lastPageId) {
        // handle the default animations
        if (!document.querySelector('html.backButtonPressed')) { // when the back button was not pressed
          document.querySelector('body > main > header > h2').style.animation = 'var(--fade-in), var(--slide-from-right)'
          document.querySelector('body > main > article').style.animation = 'var(--fade-in), var(--slide-from-right)'
        } else { // when the back button was pressed, reverse the animation direction
          document.querySelector('body > main > header > h2').style.animation = 'var(--fade-in), var(--slide-from-left)'
          document.querySelector('body > main > article').style.animation = 'var(--fade-in), var(--slide-from-left)'
        }
      }
      window.setTimeout(() => {
        // remove changes to the body overflow style for non-view transitions browsers
        document.body.style.overflow = window.oldBodyOverflow
        window.lastPageId = document.querySelector('body > main > article').id
      }, app.updateDelay * 2)
    }
  }
})

document.addEventListener('animationend', () => {
  // set last page visited to the current page (this isn't updated until the view transition is done)
  window.lastPageId = document.querySelector('body > main > article').id
})

// set last page visited to the current page on the first page load
window.lastPageId = document.querySelector('body > main > article').id

// load the same routes as the express server
require('controllers')(app)
