var pageComponent =
webpackJsonppageComponent([22],{

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _metalComponent = __webpack_require__(1);

var _metalComponent2 = _interopRequireDefault(_metalComponent);

var _metalSoy = __webpack_require__(2);

var _metalSoy2 = _interopRequireDefault(_metalSoy);

var _SocialButtons = __webpack_require__(146);

var _SocialButtons2 = _interopRequireDefault(_SocialButtons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SocialButtons = function (_Component) {
  _inherits(SocialButtons, _Component);

  function SocialButtons() {
    _classCallCheck(this, SocialButtons);

    return _possibleConstructorReturn(this, (SocialButtons.__proto__ || Object.getPrototypeOf(SocialButtons)).apply(this, arguments));
  }

  _createClass(SocialButtons, [{
    key: 'rendered',
    value: function rendered() {
      this.siteUrl = window.location.origin;
    }
  }]);

  return SocialButtons;
}(_metalComponent2.default);

;

_metalSoy2.default.register(SocialButtons, _SocialButtons2.default);

exports.default = SocialButtons;

/***/ }),

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SocialButtons", function() { return SocialButtons; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "templates", function() { return templates; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_metal_component__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_metal_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_metal_component__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_metal_soy__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_metal_soy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_metal_soy__);
/* jshint ignore:start */


var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from SocialButtons.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace SocialButtons.
 * @public
 */

goog.module('SocialButtons.incrementaldom');

/** @suppress {extraRequire} */
var soy = goog.require('soy');
/** @suppress {extraRequire} */
var soydata = goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.i18n.bidi');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
/** @suppress {extraRequire} */
goog.require('goog.string');
var IncrementalDom = goog.require('incrementaldom');
var ie_open = IncrementalDom.elementOpen;
var ie_close = IncrementalDom.elementClose;
var ie_void = IncrementalDom.elementVoid;
var ie_open_start = IncrementalDom.elementOpenStart;
var ie_open_end = IncrementalDom.elementOpenEnd;
var itext = IncrementalDom.text;
var iattr = IncrementalDom.attr;


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $render(opt_data, opt_ignored, opt_ijData) {
  ie_open('div', null, null,
      'class', 'social');
    ie_open('div', null, null,
        'class', 'social-banner');
      ie_open('p', null, null,
          'class', 'social-banner-title');
        itext('Share this article');
      ie_close('p');
    ie_close('div');
    ie_open('div', null, null,
        'class', 'social-buttons');
      ie_open('a', null, null,
          'class', 'social-button facebook',
          'href', 'https://www.facebook.com/sharer/sharer.php?u=' + opt_data.siteUrl + opt_data.page.url,
          'target', '_blank');
        ie_void('span', null, null,
            'class', 'icon-16-facebook');
      ie_close('a');
      ie_open('a', null, null,
          'class', 'social-button twitter',
          'href', 'https://twitter.com/home?status=' + opt_data.page.title + '%20' + opt_data.siteUrl + opt_data.page.url,
          'target', '_blank');
        ie_void('span', null, null,
            'class', 'icon-16-twitter');
      ie_close('a');
      ie_open('a', null, null,
          'class', 'social-button linkedin',
          'href', 'https://www.linkedin.com/shareArticle?mini=true&url=' + opt_data.siteUrl + opt_data.page.url,
          'target', '_blank');
        ie_void('span', null, null,
            'class', 'icon-16-linkedin');
      ie_close('a');
    ie_close('div');
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'SocialButtons.render';
}

exports.render.params = ["page","siteUrl"];
exports.render.types = {"page":"any","siteUrl":"any"};
templates = exports;
return exports;

});

class SocialButtons extends __WEBPACK_IMPORTED_MODULE_0_metal_component___default.a {}
__WEBPACK_IMPORTED_MODULE_1_metal_soy___default.a.register(SocialButtons, templates);

/* harmony default export */ __webpack_exports__["default"] = (templates);
/* jshint ignore:end */


/***/ })

},[132]);