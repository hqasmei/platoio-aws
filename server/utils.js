const getBooleanQueryParam = (req, paramName) => {
  // This checks for the presence of a boolean query param.
  // Note that the param doesn't need to have a value assigned,
  // its mere presence represents a 'true' value.
  // RETURNS TRUE: http://localhost:8080/job?includeDeleted
  // RETURNS TRUE: http://localhost:8080/job?includeDeleted=true
  // RETURNS FALSE: http://localhost:8080/job?includeDeleted=false
  try {
    if (paramName && req && req.query) {
      const params = new URLSearchParams(req.query)
      if (params.has(paramName)) {
        const param = params.get(paramName)
        if (param && param.trim().toLowerCase() === "false") {
          return false
        }
        return true
      }
    }
  } catch (error) {}
  return false
}

module.exports = {
  getBooleanQueryParam,
}
