// sample static global base model
var model = {
  content: {
    appTitle: 'roosevelt sample app',
    pageTitle: '{content.appTitle}'
  }
};

// extend global model provide additional useful vars at runtime and export it
module.exports = function(req, res) {
  return {

    // always static
    content: model.content,
    
    // recalculated each require
    currentYear: new Date().getFullYear(),
    mainDomain: req.headers['x-forwarded-host'] || req.headers.host,
    NODE_ENV: process.env.NODE_ENV
  };
};
