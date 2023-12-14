import { MarginsWithUnit, Point, PointWithUnit, Quadrilateral } from '../Common';
import { Anchor } from '../CommonEnums';
import { DataCaptureContext } from '../DataCaptureContext';
import { DataCaptureOverlay, DataCaptureView, DataCaptureViewListener } from '../DataCaptureView';
import { FocusGesture, ZoomGesture, Control, LogoStyle } from '../DataCaptureView+Related';
import { DefaultSerializeable } from './Serializeable';
export interface PrivateDataCaptureOverlay {
    view: PrivateDataCaptureView | null;
}
export declare class PrivateDataCaptureView extends DefaultSerializeable {
    private _context;
    viewComponent: DataCaptureView;
    get context(): DataCaptureContext | null;
    set context(context: DataCaptureContext | null);
    scanAreaMargins: MarginsWithUnit;
    pointOfInterest: PointWithUnit;
    logoAnchor: Anchor;
    logoOffset: PointWithUnit;
    focusGesture: FocusGesture | null;
    zoomGesture: ZoomGesture | null;
    private overlays;
    private controls;
    logoStyle: LogoStyle;
    private proxy;
    listeners: DataCaptureViewListener[];
    private get privateContext();
    static forContext(context: DataCaptureContext | null): PrivateDataCaptureView;
    constructor();
    addOverlay(overlay: DataCaptureOverlay): void;
    removeOverlay(overlay: DataCaptureOverlay): void;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    addControl(control: Control): void;
    removeControl(control: Control): void;
    controlUpdated(): void;
    dispose(): void;
}
