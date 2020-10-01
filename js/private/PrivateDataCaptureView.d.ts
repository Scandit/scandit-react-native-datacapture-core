import { MarginsWithUnit, Point, PointWithUnit, Quadrilateral } from '../Common';
import { Anchor } from '../CommonEnums';
import { DataCaptureContext } from '../DataCaptureContext';
import { DataCaptureOverlay, DataCaptureView, DataCaptureViewListener } from '../DataCaptureView';
import { DefaultSerializeable } from './Serializeable';
export interface PrivateDataCaptureOverlay {
    view: Optional<PrivateDataCaptureView>;
}
export declare class PrivateDataCaptureView extends DefaultSerializeable {
    private _context;
    viewComponent: DataCaptureView;
    get context(): Optional<DataCaptureContext>;
    set context(context: Optional<DataCaptureContext>);
    scanAreaMargins: MarginsWithUnit;
    pointOfInterest: PointWithUnit;
    logoAnchor: Anchor;
    logoOffset: PointWithUnit;
    private overlays;
    private proxy;
    listeners: DataCaptureViewListener[];
    private get privateContext();
    static forContext(context: Optional<DataCaptureContext>): PrivateDataCaptureView;
    constructor();
    addOverlay(overlay: DataCaptureOverlay): void;
    removeOverlay(overlay: DataCaptureOverlay): void;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    dispose(): void;
}
