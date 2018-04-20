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
    const origHtmlblock = md.renderer.rules.htmlblock

    // add links to headers
    md.renderer.rules.heading_open = function(t, idx) {
      var slug = slugify(t[idx + 1].content)
      return '<h' + t[idx].hLevel + '><a id="'+ slug + '"href="#' + slug + '">'
    }

    md.renderer.rules.heading_close = function(t, idx) {
      return '</a></h' + t[idx].hLevel+ '>'
    }

    // Remove all html comments from markdown docs
    // as they break. We use the comments for the linter
    md.renderer.rules.htmlblock = function(t, idx) {
      const content = t[idx].content

      const htmlComment =
        /<!--([^-]+|[-][^-]+)*-->/g

      return htmlComment.test(content)
        ? t[idx].content.replace(htmlComment, '')
        : origHtmlblock(t, idx)
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
