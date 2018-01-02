'use strict';

var marble = require('marble');
var slugify = require('markdown-slug');

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
    html: true
  },
  markdownRenderer: function(md) {

    // add links to headers
    md.renderer.rules.heading_open = function(t, idx) {
      var slug = slugify(t[idx + 1].content)
      return '<h' + t[idx].hLevel + '><a id="'+ slug + '"href="#' + slug + '">'
    }

    md.renderer.rules.heading_close = function(t, idx) {
      return '</a></h' + t[idx].hLevel+ '>'
    }

    return md
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
