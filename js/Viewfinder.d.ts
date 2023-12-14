import { Color, NumberWithUnit, SizeWithUnit, SizeWithUnitAndAspect } from './Common';
import { DefaultSerializeable } from './private/Serializeable';
import { LaserlineViewfinderStyle, RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle } from './Viewfinder+Related';
export interface Viewfinder {
}
export declare const NoViewfinder: {
    type: string;
};
export declare class LaserlineViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    private readonly _style;
    width: NumberWithUnit;
    enabledColor: Color;
    disabledColor: Color;
    constructor();
    constructor(style: LaserlineViewfinderStyle);
    get style(): LaserlineViewfinderStyle;
}
export declare class RectangularViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    private readonly _style;
    private readonly _lineStyle;
    private _dimming;
    private _disabledDimming;
    private _animation;
    private _sizeWithUnitAndAspect;
    private _color;
    private _disabledColor;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    constructor();
    constructor(style: RectangularViewfinderStyle);
    constructor(style: RectangularViewfinderStyle, lineStyle: RectangularViewfinderLineStyle);
    get style(): RectangularViewfinderStyle;
    get lineStyle(): RectangularViewfinderLineStyle;
    get color(): Color;
    set color(value: Color);
    get disabledColor(): Color;
    set disabledColor(value: Color);
    get dimming(): number;
    set dimming(value: number);
    get disabledDimming(): number;
    set disabledDimming(value: number);
    get animation(): RectangularViewfinderAnimation | null;
    set animation(animation: RectangularViewfinderAnimation | null);
    setSize(size: SizeWithUnit): void;
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
    setShorterDimensionAndAspectRatio(fraction: number, aspectRatio: number): void;
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
export declare class AimerViewfinder extends DefaultSerializeable implements Viewfinder {
    private type;
    frameColor: Color;
    dotColor: Color;
    constructor();
}
