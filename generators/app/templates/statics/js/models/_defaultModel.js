// what every model does on the front end, unless you write a model of your own to supersede this behavior
//
// roosevelt writes a front end counterpart for each of your models, and each one hands off to this file, so this is the one place to say what reaching your API means: a header, a credential, error handling, or something that isn't HTTP at all
//
// it receives:
//   model — the name of the model it is standing in for, e.g. 'homepage'
//   route — where to post by default, e.g. '/api/homepage'
//   args  — whatever the caller passed the model, ignored here because an isomorphic controller hands its models the
//           request and response, which are not things to send over the wire
module.exports = async ({ model, route }) => {
  const response = await fetch(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  return response.json()
}
