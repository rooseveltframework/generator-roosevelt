module.exports = async () => {
  const response = await fetch('/api/homepage', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.getElementById('csrfToken').content }, body: JSON.stringify({}) })
  return await response.json()
}
