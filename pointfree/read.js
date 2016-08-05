const isFunction = require('../internal/isFunction')

function read(m) {
  if(!(m && isFunction(m.read))) {
    throw new TypeError('read: Writer required')
  }

  return m.read()
}

module.exports = read

