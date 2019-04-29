module.exports = (data) => {
  const response = { status: true }

  if (!data) {
    return response
  }

  return {
    ...response,
    data
  }
}
