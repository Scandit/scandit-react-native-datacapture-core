import { CameraSettings } from '../Camera+Related';
export interface CameraSettingsJSON {
    preferredResolution: string;
    maxFrameRate: number;
    zoomFactor: number;
    focusRange: string;
    api: number;
}
export interface PrivateCameraSettings {
    fromJSON(json: CameraSettingsJSON): CameraSettings;
}
