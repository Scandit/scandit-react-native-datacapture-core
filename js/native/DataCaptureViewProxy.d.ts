import { Point, Quadrilateral } from '../Common';
import { PrivateDataCaptureView } from '../private/PrivateDataCaptureView';
export declare class DataCaptureViewProxy {
    private view;
    private nativeListeners;
    static forDataCaptureView(view: PrivateDataCaptureView): DataCaptureViewProxy;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral): Promise<Quadrilateral>;
    dispose(): void;
    subscribeListener(): void;
    unsubscribeListener(): void;
}
