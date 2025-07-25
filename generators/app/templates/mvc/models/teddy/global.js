module.exports = (req, res) => {
  const model = {
    content: {
      appTitle: '<%= appName %>',
      pageTitle: '{content.appTitle}', // override this on a per route level
      titleTag: '{content.appTitle} — {content.pageTitle}'
    },
    csrfToken: req.csrfToken() // add CSRF token to the model
  }
  return model
}
