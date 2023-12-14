import { MeasureUnit, SizingMode } from './CommonEnums';
import { DefaultSerializeable, Serializeable, StringSerializeable } from './private/Serializeable';
export declare class Point extends DefaultSerializeable {
    private _x;
    private _y;
    get x(): number;
    get y(): number;
    private static fromJSON;
    constructor(x: number, y: number);
}
export declare class Quadrilateral extends DefaultSerializeable {
    private _topLeft;
    private _topRight;
    private _bottomRight;
    private _bottomLeft;
    get topLeft(): Point;
    get topRight(): Point;
    get bottomRight(): Point;
    get bottomLeft(): Point;
    private static fromJSON;
    constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point);
}
export declare class NumberWithUnit extends DefaultSerializeable {
    private _value;
    private _unit;
    get value(): number;
    get unit(): MeasureUnit;
    private static fromJSON;
    constructor(value: number, unit: MeasureUnit);
}
export declare class PointWithUnit extends DefaultSerializeable {
    private _x;
    private _y;
    get x(): NumberWithUnit;
    get y(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(x: NumberWithUnit, y: NumberWithUnit);
}
export declare class Rect extends DefaultSerializeable {
    private _origin;
    private _size;
    get origin(): Point;
    get size(): Size;
    constructor(origin: Point, size: Size);
}
export declare class RectWithUnit extends DefaultSerializeable {
    private _origin;
    private _size;
    get origin(): PointWithUnit;
    get size(): SizeWithUnit;
    constructor(origin: PointWithUnit, size: SizeWithUnit);
}
export declare class SizeWithUnit extends DefaultSerializeable {
    private _width;
    private _height;
    get width(): NumberWithUnit;
    get height(): NumberWithUnit;
    constructor(width: NumberWithUnit, height: NumberWithUnit);
}
export declare class Size extends DefaultSerializeable {
    private _width;
    private _height;
    get width(): number;
    get height(): number;
    private static fromJSON;
    constructor(width: number, height: number);
}
export declare class SizeWithAspect {
    private _size;
    private _aspect;
    get size(): NumberWithUnit;
    get aspect(): number;
    constructor(size: NumberWithUnit, aspect: number);
}
export declare class SizeWithUnitAndAspect implements Serializeable {
    private _widthAndHeight;
    private _widthAndAspectRatio;
    private _heightAndAspectRatio;
    private _shorterDimensionAndAspectRatio;
    get widthAndHeight(): SizeWithUnit | null;
    get widthAndAspectRatio(): SizeWithAspect | null;
    get heightAndAspectRatio(): SizeWithAspect | null;
    get shorterDimensionAndAspectRatio(): SizeWithAspect | null;
    get sizingMode(): SizingMode;
    private static sizeWithWidthAndHeight;
    private static sizeWithWidthAndAspectRatio;
    private static sizeWithHeightAndAspectRatio;
    private static sizeWithShorterDimensionAndAspectRatio;
    private static fromJSON;
    toJSON(): object;
}
export declare class MarginsWithUnit extends DefaultSerializeable {
    private _left;
    private _right;
    private _top;
    private _bottom;
    get left(): NumberWithUnit;
    get right(): NumberWithUnit;
    get top(): NumberWithUnit;
    get bottom(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(left: NumberWithUnit, right: NumberWithUnit, top: NumberWithUnit, bottom: NumberWithUnit);
}
export declare class Color implements StringSerializeable {
    private hexadecimalString;
    get redComponent(): string;
    get greenComponent(): string;
    get blueComponent(): string;
    get alphaComponent(): string;
    get red(): number;
    get green(): number;
    get blue(): number;
    get alpha(): number;
    static fromHex(hex: string): Color;
    static fromRGBA(red: number, green: number, blue: number, alpha?: number): Color;
    private static hexToNumber;
    private static fromJSON;
    private static numberToHex;
    private static normalizeHex;
    private static normalizeAlpha;
    private constructor();
    withAlpha(alpha: number): Color;
    toJSON(): string;
}
export declare class Brush extends DefaultSerializeable {
    private static defaults;
    private fill;
    private stroke;
    static get transparent(): Brush;
    get fillColor(): Color;
    get strokeColor(): Color;
    get strokeWidth(): number;
    private get copy();
    constructor();
    constructor(fillColor: Color, strokeColor: Color, strokeWidth: number);
}
