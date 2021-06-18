import React from 'react';
import { MarginsWithUnit, Point, PointWithUnit, Quadrilateral, Size } from './Common';
import { Anchor, Orientation } from './CommonEnums';
import { DataCaptureContext } from './DataCaptureContext';
import { FocusGesture, ZoomGesture, Control, LogoStyle } from './DataCaptureView+Related';
export interface DataCaptureOverlay {
}
export interface DataCaptureViewListener {
    didChangeSize?(view: DataCaptureView, size: Size, orientation: Orientation): void;
}
interface DataCaptureViewProps {
    context: DataCaptureContext;
    style: any;
}
export declare class DataCaptureView extends React.Component<DataCaptureViewProps> {
    private view;
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
    get zoomGesture(): ZoomGesture | null;
    set zoomGesture(newValue: ZoomGesture | null);
    addOverlay(overlay: DataCaptureOverlay): void;
    removeOverlay(overlay: DataCaptureOverlay): void;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    addControl(control: Control): void;
    removeControl(control: Control): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
