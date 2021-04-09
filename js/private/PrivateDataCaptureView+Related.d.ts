import { FocusGesture, ZoomGesture } from '../DataCaptureView+Related';
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
