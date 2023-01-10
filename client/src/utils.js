import _ from "lodash"

export const getServerErrorMessage = (error) => {
  let msg = null
  if (error) {
    msg = JSON.stringify(error)
    if (error.code) {
      msg = `Server Error: ${error.code}`
    }
    if (error.message) {
      if (msg.length > 0) {
        msg += " - "
      }
      if (_.isObject(error.message)) {
        msg = `${JSON.stringify(error.message)}`
      } else {
        msg = `${error.message}`
      }
    }
  }
  return msg
}
