# react-native-pdf-page-viewer

#### This library fork by `react-native-pdf-light`, we add more function: `getBase64Image`, `isLocked`.


PDF viewer for React Native. Implemented with platform native render functions
for smallest deploy size impact, and restricted feature set to simplify
integration with larger systems.

Includes prefabricated full document viewer based on `FlatList` and a single
page render component to use as a building block for your own fully custom
viewer.

Uses `android.graphics.pdf.PdfRenderer` on Android and `CGPDFDocument` on iOS.
Unlike many native components in the wild, `react-native-pdf-page-viewer
` provides
full implementation of React Native shadow nodes. This simplifies UI
development, since the component actually knows its own dimensions.

## Installation

```sh
npm install @khanhdh1303/rn-pdf-page-viewer
```

If iOS build fails with `Undefined symbol: __swift_FORCE_LOAD_...`, add an
empty `.swift` file to the xcode project.

## Usage

```js
import { Pdf, PdfUtil } from '@khanhdh1303/rn-pdf-page-viewer';

PdfUtil.getPageCount(source).then(console.log);

<Pdf source={source} />
```

If creating your own custom viewer, import can be optimized to:
```js
import { PdfView } from '@khanhdh1303/rn-pdf-page-viewer';

<PdfView page={page} source={source} />
```

#### `<Pdf ... />` Display a pdf.

Props:
- `onError: (error: Error) => void`
  - Optional: Callback to handle errors.
- `onLoadComplete: (numberOfPages: number) => void`
  - Optional: Callback to handle pdf load completion.
  - Passed the page count of the loaded pdf.
- `onMeasurePages: (measurements: { itemHeight: number, offset: number }[]) => void`
  - Optional: Callback to receive layout details of all pages.
- `shrinkToFit: 'never' | 'portrait' | 'landscape' | 'always'`
  - Optional: Size pages such that each page can be displayed without cutoff.
  - Applies when device is in the specified orientation.
- `source: string`
  - Document to display.

The following props are forwarded to the underlying
[`FlatList`](https://reactnative.dev/docs/flatlist) component:
- `initialScrollIndex`
- `ListEmptyComponent`
- `onMomentumScrollBegin`
- `onMomentumScrollEnd`
- `onScroll`
- `onScrollBeginDrag`
- `onScrollEndDrag`
- `refreshControl`
- `scrollEventThrottle`

Methods:
- `scrollToIndex(index: number): void`
  - Scroll to the specified page (0-indexed).
- `scrollToOffset(offset: number): void`
  - Scroll to the specified offset.

#### `<PdfView ... />` Single page of a pdf.

Props:
- `page: number`
  - Page (0-indexed) of document to display.
- `resizeMode: 'contain' | 'fitWidth'`
  - Optional: How pdf page should be scaled to fit in view dimensions.
- `source: string`
  - Document to display.
- `style: ViewStyle`
  - Optional: View stylesheet.

#### `PdfUtil` Utility functions.

`PdfUtil.getPageCount(source: string): Promise<number>`
- Get the number of pages of a pdf.

`PdfUtil.getPageSizes(source: string): Promise<{ height: number; width: number }[]>`
- Get the dimensions of every page.

`PdfUtil.getBase64Image(source: string, page: number): Promise<string>`
- Get image(base64) of every page

`PdfUtil.isLocked(source: string): Promise<boolean>`
- Check pdf is protected with pwd (JUST FOR IOS), on android use try-catch, it's throw error if can't open pdf has pwd

## Known Issues

On Android API level < 26 when directly rendering pages with `PdfView` at a
non-default aspect ratio (e.g. setting both width and height of the view such
that the view's aspect ratio does not match the pdf page's aspect ratio) if
a page in the pdf is cropped or rotated, the page
may render in the wrong position. This is due to a bug in the native
`android.graphics.pdf.PdfRenderer`. (If you are aware of a fix,
[pull requests welcome](https://github.com/khanhduong1303/react-native-pdf-page-viewer/pulls).)

## Alternatives

- [react-native-pdf](https://github.com/wonday/react-native-pdf)
- [react-native-file-viewer](https://github.com/vinzscam/react-native-file-viewer)
- [react-native-view-pdf](https://github.com/rumax/react-native-PDFView)
- [rn-pdf-reader-js](https://github.com/xcarpentier/rn-pdf-reader-js)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
