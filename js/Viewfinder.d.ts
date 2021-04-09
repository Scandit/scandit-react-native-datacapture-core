import { Color, NumberWithUnit, SizeWithUnit, SizeWithUnitAndAspect } from './Common';
import { DefaultSerializeable } from './private/Serializeable';
export interface Viewfinder {
}
export declare const NoViewfinder: {
    type: string;
};
export declare class LaserlineViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    width: NumberWithUnit;
    enabledColor: Color;
    disabledColor: Color;
    constructor();
}
export declare class RectangularViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    private _sizeWithUnitAndAspect;
    color: Color;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    constructor();
    setSize(size: SizeWithUnit): void;
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
}
export declare class SpotlightViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    private _sizeWithUnitAndAspect;
    enabledBorderColor: Color;
    disabledBorderColor: Color;
    backgroundColor: Color;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    constructor();
    setSize(size: SizeWithUnit): void;
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
}
