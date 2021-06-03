import { CameraSettings } from '../Camera+Related';
export interface CameraSettingsJSON {
    preferredResolution: string;
    zoomFactor: number;
    focusRange: string;
    zoomGestureZoomFactor: number;
    focusGestureStrategy: string;
    shouldPreferSmoothAutoFocus: boolean;
    api: number;
}
export interface PrivateCameraSettings {
    fromJSON(json: CameraSettingsJSON): CameraSettings;
}
