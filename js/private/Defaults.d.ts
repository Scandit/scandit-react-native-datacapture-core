import { CameraPosition, CameraSettings, FocusGestureStrategy, FocusRange, VideoResolution } from '../Camera+Related';
import { Color, MarginsWithUnit, PointWithUnit, SizeWithUnitAndAspect } from '../Common';
import { Anchor } from '../CommonEnums';
import { LogoStyle } from '../DataCaptureView+Related';
export interface CameraSettingsDefaultsJSON {
    preferredResolution: string;
    zoomFactor: number;
    focusRange: string;
    zoomGestureZoomFactor: number;
    focusGestureStrategy: string;
    shouldPreferSmoothAutoFocus: boolean;
}
export interface PrivateCameraSettingsDefaults {
    fromJSON(json: CameraSettingsDefaultsJSON): CameraSettings;
}
export declare const Defaults: {
    Camera: {
        Settings: {
            preferredResolution: VideoResolution;
            zoomFactor: any;
            focusRange: FocusRange;
            zoomGestureZoomFactor: any;
            focusGestureStrategy: FocusGestureStrategy;
            shouldPreferSmoothAutoFocus: any;
        };
        defaultPosition: CameraPosition | null;
        availablePositions: CameraPosition[];
    };
    DataCaptureView: {
        scanAreaMargins: MarginsWithUnit;
        pointOfInterest: PointWithUnit;
        logoAnchor: Anchor;
        logoOffset: PointWithUnit;
        focusGesture: import("../DataCaptureView+Related").FocusGesture | null;
        zoomGesture: import("../DataCaptureView+Related").ZoomGesture | null;
        logoStyle: LogoStyle;
    };
    LaserlineViewfinder: any;
    RectangularViewfinder: any;
    SpotlightViewfinder: {
        size: SizeWithUnitAndAspect;
        enabledBorderColor: Color;
        disabledBorderColor: Color;
        backgroundColor: Color;
    };
    AimerViewfinder: {
        frameColor: Color;
        dotColor: Color;
    };
    Brush: {
        fillColor: Color;
        strokeColor: Color;
        strokeWidth: any;
    };
    deviceID: any;
};
