module.exports = async () => {
  const response = await fetch('/api/global', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
  return await response.json()
}
