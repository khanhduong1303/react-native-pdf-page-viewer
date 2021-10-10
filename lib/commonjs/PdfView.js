"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PdfView = PdfView;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const PdfViewNative = (0, _reactNative.requireNativeComponent)('RNPdfView');
/**
 * Single page of a pdf.
 */

function PdfView(props) {
  const {
    onError,
    onLayout,
    onLoadComplete
  } = props;
  const onPdfError = (0, _react.useCallback)(event => {
    if (onError != null) {
      onError(event.nativeEvent);
    }
  }, [onError]);
  const onPdfLoadComplete = (0, _react.useCallback)(event => {
    if (onLoadComplete != null) {
      onLoadComplete(event.nativeEvent);
    }
  }, [onLoadComplete]);
  return /*#__PURE__*/_react.default.createElement(PdfViewNative, {
    onLayout: onLayout,
    onPdfError: onPdfError,
    onPdfLoadComplete: onPdfLoadComplete,
    page: props.page,
    resizeMode: props.resizeMode,
    source: props.source,
    style: props.style
  });
}
//# sourceMappingURL=PdfView.js.map