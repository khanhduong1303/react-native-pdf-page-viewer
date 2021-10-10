import React, { useCallback } from 'react';
import { requireNativeComponent } from 'react-native';
const PdfViewNative = requireNativeComponent('RNPdfView');
/**
 * Single page of a pdf.
 */

export function PdfView(props) {
  const {
    onError,
    onLayout,
    onLoadComplete
  } = props;
  const onPdfError = useCallback(event => {
    if (onError != null) {
      onError(event.nativeEvent);
    }
  }, [onError]);
  const onPdfLoadComplete = useCallback(event => {
    if (onLoadComplete != null) {
      onLoadComplete(event.nativeEvent);
    }
  }, [onLoadComplete]);
  return /*#__PURE__*/React.createElement(PdfViewNative, {
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