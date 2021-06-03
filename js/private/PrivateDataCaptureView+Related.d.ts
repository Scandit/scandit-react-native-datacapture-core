import { FocusGesture, ZoomGesture } from '../DataCaptureView+Related';
import { PrivateDataCaptureView } from './PrivateDataCaptureView';
export interface FocusGestureJSON {
    type: string;
}
export declare class PrivateFocusGestureDeserializer {
    static fromJSON(json: FocusGestureJSON | null): FocusGesture | null;
}
export interface ZoomGestureJSON {
    type: string;
}
export declare class PrivateZoomGestureDeserializer {
    static fromJSON(json: ZoomGestureJSON | null): ZoomGesture | null;
}
export interface PrivateControl {
    view: PrivateDataCaptureView | null;
}
