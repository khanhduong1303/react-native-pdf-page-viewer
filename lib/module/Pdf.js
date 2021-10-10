import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PdfUtil } from './PdfUtil';
import { PdfView } from './PdfView';
const separatorSize = 8;
/**
 * Report measurements of all pages to a callback.
 */

function useMeasurePages(layoutWidth, pageDims, maxPageHeight, onMeasurePages) {
  useEffect(() => {
    if (onMeasurePages == null || layoutWidth === 0) {
      return;
    }

    const measurements = [];
    let offset = 0;

    for (const pageSize of pageDims) {
      // Measurements include scaling to fill width,
      const itemHeight = Math.min(maxPageHeight, layoutWidth * pageSize.height / pageSize.width);
      measurements.push({
        itemHeight,
        offset
      }); // and offset for separator between pages.

      offset += itemHeight + separatorSize;
    }

    onMeasurePages(measurements);
  }, [layoutWidth, maxPageHeight, onMeasurePages, pageDims]);
}
/**
 * Display a pdf.
 */


export const Pdf = /*#__PURE__*/forwardRef((props, ref) => {
  var _maxPageHeight;

  const {
    onError,
    onLoadComplete,
    source
  } = props;
  const [flatListLayout, setFlatListLayout] = useState({
    height: 0,
    width: 0
  });
  const [pageDims, setPageDims] = useState([]);
  const listRef = useRef(null);
  useImperativeHandle(ref, () => ({
    scrollToIndex: index => {
      var _listRef$current;

      return (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.scrollToIndex({
        animated: true,
        index
      });
    },
    scrollToOffset: offset => {
      var _listRef$current2;

      return (_listRef$current2 = listRef.current) === null || _listRef$current2 === void 0 ? void 0 : _listRef$current2.scrollToOffset({
        animated: true,
        offset
      });
    }
  }), [listRef]);
  useEffect(() => {
    const state = {
      live: true
    };
    PdfUtil.getPageSizes(source).then(sizes => {
      if (state.live) {
        setPageDims(sizes);

        if (onLoadComplete != null) {
          onLoadComplete(sizes.length);
        }
      }
    }).catch(error => {
      if (state.live && onError != null) {
        onError(error);
      }
    });
    return () => {
      state.live = false;
    };
  }, [onError, onLoadComplete, setPageDims, source]);
  let maxPageHeight;

  if (flatListLayout.height > 0) {
    if (props.shrinkToFit === 'always' || flatListLayout.height > flatListLayout.width && props.shrinkToFit === 'portrait' || flatListLayout.height < flatListLayout.width && props.shrinkToFit === 'landscape') {
      maxPageHeight = flatListLayout.height;
    }
  }

  useMeasurePages(flatListLayout.width, pageDims, (_maxPageHeight = maxPageHeight) !== null && _maxPageHeight !== void 0 ? _maxPageHeight : Number.MAX_VALUE, props.onMeasurePages);
  return /*#__PURE__*/React.createElement(FlatList, {
    data: flatListLayout.height === 0 ? [] : pageDims,
    getItemLayout: (data, index) => {
      // Default height, so layout computation will always return non-zero.
      // This case should never occur.
      let itemHeight = 100;
      let offset = (itemHeight + separatorSize) * index;

      if (data == null) {
        console.warn('Pdf list getItemLayout() not passed data.');
      } else if (flatListLayout.height === 0 || flatListLayout.width === 0) {
        console.warn('Pdf list getItemLayout() could not determine screen size.');
      } else {
        var _maxPageHeight2;

        const bound = (_maxPageHeight2 = maxPageHeight) !== null && _maxPageHeight2 !== void 0 ? _maxPageHeight2 : Number.MAX_VALUE;
        let pageSize = data[index];
        itemHeight = Math.min(bound, flatListLayout.width * pageSize.height / pageSize.width); // Add up the separators and heights of pages before the current page.

        offset = 0;

        for (let i = 0; i < index; ++i) {
          pageSize = data[i];
          offset += separatorSize + Math.min(bound, flatListLayout.width * pageSize.height / pageSize.width);
        }
      }

      return {
        length: itemHeight,
        offset,
        index
      };
    },
    initialNumToRender: 1,
    ItemSeparatorComponent: () => /*#__PURE__*/React.createElement(View, {
      style: styles.separator
    }),
    keyExtractor: (_item, index) => index.toString(),
    maxToRenderPerBatch: 2,
    onLayout: event => {
      // For sizing pages to fit width, including on device rotation.
      setFlatListLayout({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width
      });
    },
    ref: listRef,
    renderItem: ({
      index
    }) => /*#__PURE__*/React.createElement(View, {
      style: [styles.pageAlign, {
        maxHeight: maxPageHeight
      }]
    }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(PdfView, {
      page: index,
      source: source,
      style: styles.page
    }))),
    windowSize: 5,
    initialScrollIndex: props.initialScrollIndex,
    ListEmptyComponent: props.ListEmptyComponent,
    onMomentumScrollBegin: props.onMomentumScrollBegin,
    onMomentumScrollEnd: props.onMomentumScrollEnd,
    onScroll: props.onScroll,
    onScrollBeginDrag: props.onScrollBeginDrag,
    onScrollEndDrag: props.onScrollEndDrag,
    refreshControl: props.refreshControl,
    scrollEventThrottle: props.scrollEventThrottle,
    testID: "pdfFlatList"
  });
});
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62
  },
  pageAlign: {
    alignItems: 'center'
  },
  separator: {
    height: separatorSize
  }
});
//# sourceMappingURL=Pdf.js.map