import { LayoutChangeEvent, ViewStyle } from 'react-native';
export declare type ErrorEvent = {
    message: string;
};
export declare type LoadCompleteEvent = {
    height: number;
    width: number;
    base64: string;
};
export declare type ResizeMode = 'contain' | 'fitWidth';
declare type PdfViewProps = {
    /**
     * Callback to handle errors.
     */
    onError?: (event: ErrorEvent) => void;
    /**
     * Callback for measuring the native view.
     *
     * Triggers on mount and layout changes.
     */
    onLayout?: (event: LayoutChangeEvent) => void;
    /**
     * Callback to handle pdf load completion.
     *
     * Passed the dimensions of the rendered page.
     */
    onLoadComplete?: (event: LoadCompleteEvent) => void;
    /**
     * Page (0-indexed) of document to display.
     */
    page: number;
    /**
     * How pdf page should be scaled to fit in view dimensions.
     *
     * `contain`
     *   - Center and scale to the largest size that does not crop content.
     * `fitWidth`
     *   - Scale pdf page so width matches view. If aspect ratio of the pdf
     *     does not match the view, content will be cropped/space buffered at
     *     the bottom.
     */
    resizeMode?: ResizeMode;
    /**
     * Document to display.
     */
    source: string;
    style?: ViewStyle;
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID?: string;
};
/**
 * Single page of a pdf.
 */
export declare function PdfView(props: PdfViewProps): JSX.Element;
export {};
