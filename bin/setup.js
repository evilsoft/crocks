/* eslint no-console: 0 */
var fs = require('fs')
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')
var os = require('os')

var root = resolve(__dirname, '..')
var docs = resolve(__dirname, '..', 'docs')
var isWindows = os.platform().startsWith('win')
var npmCmd = isWindows ? 'npm.cmd' : 'npm'
var rmrf = isWindows ? 'if exist "node_modules" (rd /s /q node_modules)' : 'rm -rf node_modules'

cp.execSync('cls', { env: process.env, stdio: 'inherit' })

install(root)
install(docs)

function install(dir) {
  console.log('working on ' + dir)

  if (!fs.existsSync(join(dir, 'package.json'))) { return }

  if (fs.existsSync(join(dir, 'node_modules'))) {
    console.log('Found a node_modules folder exists, deleting...')

    cp.execSync(rmrf, { env: process.env, cwd: dir, stdio: 'inherit' })
  }

  console.log('Running npm install...')
  cp.spawnSync(npmCmd, [ 'i' ], { env: process.env, cwd: dir, stdio: 'inherit' })
}
