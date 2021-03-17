import { CameraPosition, CameraSettings, FocusGestureStrategy, FocusRange, VideoResolution } from '../Camera+Related';
import { Color, MarginsWithUnit, NumberWithUnit, PointWithUnit, SizeWithUnitAndAspect } from '../Common';
import { Anchor } from '../CommonEnums';
export interface CameraSettingsDefaultsJSON {
    preferredResolution: string;
    zoomFactor: number;
    focusRange: string;
    zoomGestureZoomFactor: number;
    focusGestureStrategy: string;
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
        };
        defaultPosition: CameraPosition | null;
        availablePositions: CameraPosition[];
    };
    DataCaptureView: {
        scanAreaMargins: MarginsWithUnit;
        pointOfInterest: PointWithUnit;
        logoAnchor: Anchor;
        logoOffset: PointWithUnit;
        focusGesture: import("..").FocusGesture | null;
        zoomGesture: import("..").FocusGesture | null;
    };
    LaserlineViewfinder: {
        width: NumberWithUnit;
        enabledColor: Color;
        disabledColor: Color;
    };
    RectangularViewfinder: {
        size: SizeWithUnitAndAspect;
        color: Color;
    };
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
