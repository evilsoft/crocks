const isFunction = require('../internal/isFunction')

function read(m) {
  if(!(m && isFunction(m.read))) {
    throw new TypeError('read: Arg must be a Writer')
  }

  return m.read()
}

module.exports = read

