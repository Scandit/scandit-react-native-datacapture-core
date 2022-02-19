import { CameraSettings, FrameData as IFrameData, ImageBuffer } from '../Camera+Related';
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
export interface PrivateImageBuffer {
    _width: number;
    _height: number;
    _data: string;
}
export interface FrameDataJSON {
    imageBuffers: ImageBufferJSON[];
    orientation: number;
}
export interface ImageBufferJSON {
    width: number;
    height: number;
    data: string;
}
export declare class FrameData implements IFrameData {
    private _imageBuffers;
    private _orientation;
    get imageBuffers(): ImageBuffer[];
    get orientation(): number;
    static fromJSON(json: FrameDataJSON): IFrameData;
}
