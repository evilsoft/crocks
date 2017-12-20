'use strict';

var marble = require('marble');

module.exports = {
  metalComponents: ['electric-marble-components', 'marble-topbar'],
  sassOptions: {
    includePaths: ['node_modules', marble.src]
  },
  basePath: '/crocks',
  deployOptions: {
    branch: 'gh-pages'
  },
  codeMirrorLanguages: ['javascript', 'haskell'],
  vendorSrc: ['node_modules/marble/build/fonts/**']
};
