'use strict';

var marble = require('marble');

module.exports = {
  basePath: '/crocks',
  deployOptions: {
    branch: 'gh-pages'
  },
  codeMirrorTheme: 'blackboard',
  codeMirrorLanguages: [
    'javascript', 'haskell'
  ],
  envOptions: {
    dev: {
      basePath: ''
    }
  },
  markdownOptions: {
    html: true,
    linkify: true
  },
  metalComponents: [
    'electric-marble-components',
    'marble-topbar'
  ],
  sassOptions: {
    includePaths: [
      'node_modules', marble.src
    ]
  },
  vendorSrc: [
    'node_modules/marble/build/fonts/**'
  ]
};
