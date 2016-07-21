// isObject:: a -> Bool
function isObject(x) {
  return !!x
    && x.toString
    && x.toString() === '[object Object]'
}

module.exports = isObject
