import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, RefreshControlProps } from 'react-native';
export declare type PageMeasurement = {
    /**
     * Display height of the page.
     */
    itemHeight: number;
    /**
     * Position (dp) within the FlatList.
     */
    offset: number;
};
/**
 * Optional props, forwarded to the underlying `FlatList` component.
 */
declare type BaseListProps = {
    /**
     * Instead of starting at the top with the first item, start at
     * initialScrollIndex.
     */
    initialScrollIndex?: number;
    /**
     * Rendered when the list is empty. Can be a React Component Class, a render
     * function, or a rendered element.
     */
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
    /**
     * Called when the momentum scroll starts (scroll which occurs as the scroll
     * view starts gliding).
     */
    onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Called when the momentum scroll ends (scroll which occurs as the scroll
     * view glides to a stop).
     */
    onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Fires at most once per frame during scrolling. The frequency of the events
     * can be controlled using the scrollEventThrottle prop.
     */
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Called when the user begins to drag the scroll view.
     */
    onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * Called when the user stops dragging the scroll view and it either stops or
     * begins to glide.
     */
    onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    /**
     * A RefreshControl component, used to provide pull-to-refresh
     * functionality for the ScrollView.
     */
    refreshControl?: React.ReactElement<RefreshControlProps>;
    /**
     * This controls how often the scroll event will be fired while scrolling
     * (in events per seconds). A higher number yields better accuracy for code
     * that is tracking the scroll position, but can lead to scroll performance
     * problems due to the volume of information being send over the bridge. The
     * default value is zero, which means the scroll event will be sent only once
     * each time the view is scrolled.
     * Only available on iOS.
     */
    scrollEventThrottle?: number;
};
export declare type PdfRef = {
    /**
     * Scroll to the specified page (0-indexed).
     */
    scrollToIndex(index: number): void;
    /**
     * Scroll to the specified offset.
     */
    scrollToOffset(offset: number): void;
};
/**
 * Display a pdf.
 */
export declare const Pdf: React.ForwardRefExoticComponent<BaseListProps & {
    /**
     * Callback to handle errors.
     */
    onError?: ((error: Error) => void) | undefined;
    /**
     * Callback to handle pdf load completion.
     *
     * Passed the page count of the loaded pdf.
     */
    onLoadComplete?: ((numberOfPages: number) => void) | undefined;
    /**
     * Callback to receive layout details of all pages.
     */
    onMeasurePages?: ((measurements: PageMeasurement[]) => void) | undefined;
    /**
     * Size pages such that each page can be displayed without cutoff. Applies
     * when device is in the specified orientation.
     */
    shrinkToFit?: "never" | "portrait" | "landscape" | "always" | undefined;
    /**
     * Document to display.
     */
    source: string;
    /**
     * Used to locate this view in end-to-end tests.
     */
    testID?: string | undefined;
} & React.RefAttributes<PdfRef>>;
export {};
