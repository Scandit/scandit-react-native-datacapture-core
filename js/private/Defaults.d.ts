import { CameraPosition, CameraSettings, FocusRange, VideoResolution } from '../Camera+Related';
import { Color, MarginsWithUnit, NumberWithUnit, PointWithUnit, SizeWithUnitAndAspect } from '../Common';
import { Anchor } from '../CommonEnums';
export interface CameraSettingsDefaultsJSON {
    preferredResolution: string;
    maxFrameRate: number;
    zoomFactor: number;
    focusRange: string;
}
export interface PrivateCameraSettingsDefaults {
    fromJSON(json: CameraSettingsDefaultsJSON): CameraSettings;
}
export declare const Defaults: {
    Camera: {
        Settings: {
            preferredResolution: VideoResolution;
            maxFrameRate: any;
            zoomFactor: any;
            focusRange: FocusRange;
        };
        defaultPosition: Optional<CameraPosition>;
        availablePositions: CameraPosition[];
    };
    DataCaptureView: {
        scanAreaMargins: MarginsWithUnit;
        pointOfInterest: PointWithUnit;
        logoAnchor: Anchor;
        logoOffset: PointWithUnit;
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
    Brush: {
        fillColor: Color;
        strokeColor: Color;
        strokeWidth: any;
    };
    deviceID: any;
};
