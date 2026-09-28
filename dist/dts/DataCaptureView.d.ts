import React from 'react';
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { Control, FocusGesture, LogoStyle, MarginsWithUnit, Point, PointWithUnit, BaseDataCaptureView, Quadrilateral, Size, ZoomGesture, Serializeable } from 'scandit-datacapture-frameworks-core';
import { Anchor, Orientation } from 'scandit-datacapture-frameworks-core';
import { DataCaptureContext } from 'scandit-datacapture-frameworks-core';
export interface DataCaptureOverlay extends Serializeable {
}
export interface DataCaptureViewListener {
    didChangeSize?(view: DataCaptureView, size: Size, orientation: Orientation): void;
}
interface DataCaptureViewProps {
    context: DataCaptureContext;
    style: StyleProp<ViewStyle>;
    parentId?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
}
export declare class DataCaptureView extends React.Component<DataCaptureViewProps> {
    protected view: BaseDataCaptureView;
    private _isMounted;
    private _viewCreated;
    private _createViewRafHandle;
    constructor(props: DataCaptureViewProps);
    get scanAreaMargins(): MarginsWithUnit;
    set scanAreaMargins(newValue: MarginsWithUnit);
    get pointOfInterest(): PointWithUnit;
    set pointOfInterest(newValue: PointWithUnit);
    get logoStyle(): LogoStyle;
    set logoStyle(style: LogoStyle);
    get logoAnchor(): Anchor;
    set logoAnchor(newValue: Anchor);
    get logoOffset(): PointWithUnit;
    set logoOffset(newValue: PointWithUnit);
    get focusGesture(): FocusGesture | null;
    set focusGesture(newValue: FocusGesture | null);
    get zoomGestures(): ZoomGesture[];
    set zoomGestures(newValue: ZoomGesture[]);
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    get zoomGesture(): ZoomGesture | null;
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    set zoomGesture(newValue: ZoomGesture | null);
    get shouldShowZoomNotification(): boolean;
    set shouldShowZoomNotification(newValue: boolean);
    setProperty<T>(name: string, value: T): void;
    addOverlay(overlay: DataCaptureOverlay): Promise<void>;
    removeOverlay(overlay: DataCaptureOverlay): Promise<void>;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    addControl(control: Control): Promise<void>;
    addControlWithAnchorAndOffset(control: Control, anchor: Anchor, offset: PointWithUnit): void;
    removeControl(control: Control): void;
    componentWillUnmount(): void;
    componentDidMount(): void;
    render(): React.JSX.Element;
    protected removeAllOverlays(): void;
    private onNativeViewLayout;
    private tryCreateDataCaptureView;
    private scheduleCreateDataCaptureView;
}
export {};
