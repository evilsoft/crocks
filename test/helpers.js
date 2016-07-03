const noop = () => {}
const bindFunc = fn => x => fn.bind(null, x)

module.exports = {
  noop, bindFunc
}
