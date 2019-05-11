module.exports = (data, status) => {
  const response = { status: status ? false : true }

  if (!data) {
    return response
  }

  return {
    ...response,
    data
  }
}
