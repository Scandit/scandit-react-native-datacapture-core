import EventEmitter$1, { EventEmitter } from 'eventemitter3';
export { EventEmitter } from 'eventemitter3';

/**
 * Defines the alignment of the text in its view.
 *
 * @since 7.1.0
 */
declare enum FontFamily {
    /**
     * Default system font on Android and iOS.
     *
     * @since 7.1.0
     */
    SystemDefault = "systemDefault",
    /**
     * Will use [monospace](https://developer.android.com/reference/kotlin/androidx/glance/text/FontFamily#Monospace()) on Android and [Courier](https://developer.apple.com/fonts/) on iOS.
     *
     * @since 7.1.0
     */
    ModernMono = "modernMono",
    /**
     * Will use [SansSerif](https://developer.android.com/reference/kotlin/androidx/glance/text/FontFamily#SansSerif()) on Android and [Helvetica](https://developer.apple.com/fonts/) on iOS.
     *
     * @since 7.1.0
     */
    SystemSans = "systemSans"
}

/**
 * Defines the alignment of the text in its view.
 *
 * @since 7.1.0
 */
declare enum TextAlignment {
    /**
     * Align the text on the left edge of the view.
     *
     * @since 7.1.0
     */
    Left = "left",
    /**
     * Align the text on the right edge of the view.
     *
     * @since 7.1.0
     */
    Right = "right",
    /**
     * Align the text in the center of the view.
     *
     * @since 7.1.0
     */
    Center = "center",
    /**
     * Align the text on the leading edge of the view.
     *
     * @since 7.1.0
     */
    Start = "start",
    /**
     * Align the text on the trailing edge of the view.
     *
     * @since 7.1.0
     */
    End = "end"
}

interface Serializeable {
    toJSON: () => object;
}

interface StringSerializeable {
    toJSON: () => string;
}

declare function ignoreFromSerialization(target: any, propertyName: string): void;

declare function nameForSerialization(customName: string): (target: any, propertyName: string) => void;

declare function ignoreFromSerializationIfNull(target: any, propertyName: string): void;

declare function serializationDefault(defaultValue: any): (target: any, propertyName: string) => void;

declare class DefaultSerializeable implements Serializeable {
    toJSON(): object;
}

interface PointJSON {
    x: number;
    y: number;
}
interface PrivatePoint {
    fromJSON(json: PointJSON): Point;
}
/** @since 6.5.0 */
declare class Point extends DefaultSerializeable {
    private _x;
    private _y;
    /**
     * X coordinate of the point.
     *
     * @since 6.5.0
     */
    get x(): number;
    /**
     * Y coordinate of the point.
     *
     * @since 6.5.0
     */
    get y(): number;
    private static fromJSON;
    /**
     * Constructs a new point at position *x* and *y*.
     *
     * @since 6.5.0
     */
    constructor(x: number, y: number);
}

interface QuadrilateralJSON {
    topLeft: PointJSON;
    topRight: PointJSON;
    bottomRight: PointJSON;
    bottomLeft: PointJSON;
}
interface PrivateQuadrilateral {
    fromJSON(json: QuadrilateralJSON): Quadrilateral$1;
}
/**
 * Polygon represented by 4 corners.
 *
 * @since 6.5.0
 */
declare class Quadrilateral$1 extends DefaultSerializeable {
    private _topLeft;
    private _topRight;
    private _bottomRight;
    private _bottomLeft;
    /** @since 6.5.0 */
    get topLeft(): Point;
    /** @since 6.5.0 */
    get topRight(): Point;
    /** @since 6.5.0 */
    get bottomRight(): Point;
    /** @since 6.5.0 */
    get bottomLeft(): Point;
    private static fromJSON;
    constructor(topLeft: Point, topRight: Point, bottomRight: Point, bottomLeft: Point);
}

/**
 * Specifies in what units the value has been specified (fraction, device-independent pixels, pixels).
 *
 * @since 6.5.0
 */
declare enum MeasureUnit {
    /**
     * Value is measured in device-independent pixels.
     *
     * @since 6.5.0
     */
    DIP = "dip",
    /**
     * Value is measured in pixels.
     *
     * @since 6.5.0
     */
    Pixel = "pixel",
    /**
     * Value is measured as a fraction. Valid values range from 0 to 1. This can be used to specify values in relative coordinates with respect to a reference, e.g. the view width or height.
     *
     * @since 6.5.0
     */
    Fraction = "fraction"
}

interface NumberWithUnitJSON {
    value: number;
    unit: string;
}
interface PrivateNumberWithUnit {
    fromJSON(json: NumberWithUnitJSON): NumberWithUnit;
}
/**
 * Holds a floating-point value plus a measure unit.
 *
 * @since 6.5.0
 */
declare class NumberWithUnit extends DefaultSerializeable {
    private _value;
    private _unit;
    /** @since 6.5.0 */
    get value(): number;
    /** @since 6.5.0 */
    get unit(): MeasureUnit;
    private static fromJSON;
    /**
     * Constructs a new float with unit.
     *
     * @since 8.5.0
     */
    constructor(value: number, unit: MeasureUnit);
}

interface PointWithUnitJSON {
    x: NumberWithUnitJSON;
    y: NumberWithUnitJSON;
}
interface PrivatePointWithUnit {
    readonly zero: PointWithUnit;
    fromJSON(json: PointWithUnitJSON): PointWithUnit;
}
/** @since 6.5.0 */
declare class PointWithUnit extends DefaultSerializeable {
    private _x;
    private _y;
    /**
     * X coordinate of the point.
     *
     * @since 6.5.0
     */
    get x(): NumberWithUnit;
    /**
     * Y coordinate of the point.
     *
     * @since 6.5.0
     */
    get y(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(x: NumberWithUnit, y: NumberWithUnit);
}

interface SizeJSON {
    width: number;
    height: number;
}
interface PrivateSize {
    fromJSON(json: SizeJSON): Size;
}
/** @since 6.5.0 */
declare class Size extends DefaultSerializeable {
    private _width;
    private _height;
    /**
     * The width.
     *
     * @since 6.5.0
     */
    get width(): number;
    /**
     * The height.
     *
     * @since 6.5.0
     */
    get height(): number;
    private static fromJSON;
    /** @since 6.5.0 */
    constructor(width: number, height: number);
}

/** @since 6.5.0 */
declare class Rect$1 extends DefaultSerializeable {
    private _origin;
    private _size;
    /**
     * The origin (top-left corner) of the rectangle.
     *
     * @since 6.5.0
     */
    get origin(): Point;
    /**
     * The size of the rectangle.
     *
     * @since 6.5.0
     */
    get size(): Size;
    /**
     * Constructs a new rectangle.
     *
     * @since 6.5.0
     */
    constructor(origin: Point, size: Size);
}

/** @since 6.5.0 */
declare class SizeWithUnit extends DefaultSerializeable {
    private _width;
    private _height;
    /**
     * The width.
     *
     * @since 6.5.0
     */
    get width(): NumberWithUnit;
    /**
     * The height.
     *
     * @since 6.5.0
     */
    get height(): NumberWithUnit;
    constructor(width: NumberWithUnit, height: NumberWithUnit);
}

/** @since 6.5.0 */
declare class RectWithUnit extends DefaultSerializeable {
    private _origin;
    private _size;
    /**
     * The origin (top-left corner) of the rectangle.
     *
     * @since 6.5.0
     */
    get origin(): PointWithUnit;
    /**
     * The size of the rectangle.
     *
     * @since 6.5.0
     */
    get size(): SizeWithUnit;
    constructor(origin: PointWithUnit, size: SizeWithUnit);
}

type ColorJSON = string;
interface PrivateColor {
    fromJSON(json: ColorJSON): Color$1;
}
/** @since 6.5.0 */
declare class Color$1 implements StringSerializeable {
    private hexadecimalString;
    /**
     * Red component of the color as a hexadecimal string.
     *
     * @since 6.5.0
     */
    get redComponent(): string;
    /**
     * Green component of the color as a hexadecimal string.
     *
     * @since 6.5.0
     */
    get greenComponent(): string;
    /**
     * Blue component of the color as a hexadecimal string.
     *
     * @since 6.5.0
     */
    get blueComponent(): string;
    /**
     * Alpha component of the color as a hexadecimal string.
     *
     * @since 6.5.0
     */
    get alphaComponent(): string;
    /**
     * Red component of the color as a decimal value.
     *
     * @since 6.5.0
     */
    get red(): number;
    /**
     * Green component of the color as a decimal value.
     *
     * @since 6.5.0
     */
    get green(): number;
    /**
     * Blue component of the color as a decimal value.
     *
     * @since 6.5.0
     */
    get blue(): number;
    /**
     * Alpha component of the color as a decimal value.
     *
     * @since 6.5.0
     */
    get alpha(): number;
    /**
     * Creates a color from a hexadecimal string. Colors can be represented by hexadecimal strings in the following formats (R = red, G = green, B = blue, A = alpha) with an optional # prefix. The characters can be upper or lower case:
     *
     * - RRGGBB
     * - RRGGBBAA
     * - #RRGGBB
     * - #RRGGBBAA
     * - RGB
     * - RGBA
     * - #RGB
     * - #RGBA
     *
     * @since 6.5.0
     */
    static fromHex(hex: string): Color$1;
    /**
     * Creates a color from numerical color components.
     *
     * @since 6.5.0
     */
    static fromRGBA(red: number, green: number, blue: number, alpha?: number): Color$1;
    private static hexToNumber;
    private static fromJSON;
    private static numberToHex;
    private static normalizeHex;
    private static normalizeAlpha;
    private constructor();
    /**
     * Creates a color that only differs in it’s alpha component.
     *
     * @since 6.5.0
     */
    withAlpha(alpha: number): Color$1;
    toJSON(): string;
}

/**
 * The icon shapes.
 *
 * @since 7.1.0
 */
declare enum ScanditIconShape {
    /**
     * Circle shape.
     *
     * @since 7.1.0
     */
    Circle = "circle",
    /**
     * Square shape.
     *
     * @since 7.1.0
     */
    Square = "square"
}

/**
 * The icon types.
 *
 * @since 7.1.0
 */
declare enum ScanditIconType {
    /**
     * Arrow pointing right.
     *
     * @since 7.1.0
     */
    ArrowRight = "arrowRight",
    /**
     * Arrow pointing left.
     *
     * @since 7.1.0
     */
    ArrowLeft = "arrowLeft",
    /**
     * Arrow pointing up.
     *
     * @since 7.1.0
     */
    ArrowUp = "arrowUp",
    /**
     * Arrow pointing down.
     *
     * @since 7.1.0
     */
    ArrowDown = "arrowDown",
    /**
     * To pick icon.
     *
     * @since 7.1.0
     */
    ToPick = "toPick",
    /**
     * Checkmark icon.
     *
     * @since 7.1.0
     */
    Checkmark = "checkmark",
    /**
     * X icon.
     *
     * @since 7.1.0
     */
    XMark = "xMark",
    /**
     * Question mark icon.
     *
     * @since 7.1.0
     */
    QuestionMark = "questionMark",
    /**
     * Exclamation mark icon.
     *
     * @since 7.1.0
     */
    ExclamationMark = "exclamationMark",
    /**
     * Low stock icon.
     *
     * @since 7.1.0
     */
    LowStock = "lowStock",
    /**
     * Expired item icon.
     *
     * @since 7.1.0
     */
    ExpiredItem = "expiredItem",
    /**
     * Wrong item icon.
     *
     * @since 7.1.0
     */
    WrongItem = "wrongItem",
    /**
     * Fragile item icon.
     *
     * @since 7.1.0
     */
    FragileItem = "fragileItem",
    /**
     * Filled star icon.
     *
     * @since 7.1.0
     */
    StarFilled = "starFilled",
    /**
     * Half-filled star icon.
     *
     * @since 7.1.0
     */
    StarHalfFilled = "starHalfFilled",
    /**
     * Chevron pointing up.
     *
     * @since 7.1.0
     */
    ChevronUp = "chevronUp",
    /**
     * Chevron pointing down.
     *
     * @since 7.1.0
     */
    ChevronDown = "chevronDown",
    /**
     * Chevron pointing left.
     *
     * @since 7.1.0
     */
    ChevronLeft = "chevronLeft",
    /**
     * Chevron pointing right.
     *
     * @since 7.1.0
     */
    ChevronRight = "chevronRight",
    /**
     * Inspect item icon.
     *
     * @since 7.1.0
     */
    InspectItem = "inspectItem",
    /**
     * Outlined Star icon.
     *
     * @since 7.1.0
     */
    StarOutlined = "starOutlined",
    /**
     * Print icon.
     *
     * @since 7.1.0
     */
    Print = "print",
    /**
     * Plus icon.
     *
     * @since 8.5.0
     */
    Plus = "plus",
    /**
     * Horizontal minus icon.
     *
     * @since 8.5.0
     */
    Minus = "minus",
    /**
     * Delete/trash can icon.
     *
     * @since 8.5.0
     */
    Delete = "delete",
    /**
     * Slash icon.
     *
     * @since 8.5.0
     */
    Slash = "slash"
}

type ScanditIconJSON = {
    backgroundColor: Color$1 | null;
    backgroundShape: ScanditIconShape | null;
    icon: ScanditIconType | null;
    iconColor: Color$1 | null;
    backgroundStrokeColor: Color$1 | null;
    backgroundStrokeWidth: number;
};
interface PrivateScanditIcon {
    fromJSON(json: ScanditIconJSON): ScanditIcon;
}
/**
 * Class that holds a Scandit icon.
 *
 * @since 7.1.0
 */
declare class ScanditIcon extends DefaultSerializeable {
    private _backgroundColor;
    private _backgroundShape;
    private _icon;
    private _iconColor;
    private _backgroundStrokeColor;
    private _backgroundStrokeWidth;
    private static fromJSON;
    private static colorFromJSON;
    /**
     * Constructs a scandit icon builder to build a scandit icon.
     *
     * @since 7.1.0
     */
    constructor(iconColor: Color$1 | null, backgroundColor: Color$1 | null, backgroundShape: ScanditIconShape | null, icon: ScanditIconType | null, backgroundStrokeColor: Color$1 | null, backgroundStrokeWidth: number);
    /**
     * The color applied to the icon’s background.
     *
     * @since 7.1.0
     */
    get backgroundColor(): Color$1 | null;
    /**
     * The icon’s background shape.
     *
     * @since 7.1.0
     */
    get backgroundShape(): ScanditIconShape | null;
    /**
     * The icon.
     *
     * @since 7.1.0
     */
    get icon(): ScanditIconType | null;
    /**
     * The color of the icon. When not set, the icon is rendered in white.
     *
     * @since 7.1.0
     */
    get iconColor(): Color$1 | null;
    /**
     * The color of the stroke applied to the icon’s background.
     *
     * @since 7.1.0
     */
    get backgroundStrokeColor(): Color$1 | null;
    /**
     * The width of the stroke applied to the icon’s background.
     *
     * @since 7.1.0
     */
    get backgroundStrokeWidth(): number;
}

/**
 * Use this object to construct instances of {@link ScanditIcon}.
 *
 * @since 7.1.0
 */
declare class ScanditIconBuilder {
    private _iconColor;
    private _backgroundColor;
    private _backgroundShape;
    private _icon;
    private _backgroundStrokeColor;
    private _backgroundStrokeWidth;
    /**
     * Sets the color of the icon.
     *
     * @since 7.1.0
     */
    withIconColor(iconColor: Color$1 | null): ScanditIconBuilder;
    /**
     * Sets the color applied to the icon’s background.
     *
     * @since 7.1.0
     */
    withBackgroundColor(backgroundColor: Color$1 | null): ScanditIconBuilder;
    /**
     * Sets the icon’s background shape.
     *
     * @since 7.1.0
     */
    withBackgroundShape(backgroundShape: ScanditIconShape | null): ScanditIconBuilder;
    /**
     * Sets the icon.
     *
     * @since 7.1.0
     */
    withIcon(iconType: ScanditIconType | null): ScanditIconBuilder;
    /**
     * Sets the color of the stroke applied to the icon’s background.
     *
     * @since 7.1.0
     */
    withBackgroundStrokeColor(backgroundStrokeColor: Color$1 | null): ScanditIconBuilder;
    /**
     * Sets the width of the stroke applied to the icon’s background.
     *
     * @since 7.1.0
     */
    withBackgroundStrokeWidth(backgroundStrokeWidth: number): ScanditIconBuilder;
    /**
     * Constructs a {@link ScanditIcon} with the properties set on the builder.
     *
     * @since 7.1.0
     */
    build(): ScanditIcon;
}

/**
 * Holds values to define a rectangular size using a dimension and an aspect ratio multiplier.
 *
 * @since 6.5.0
 */
declare class SizeWithAspect extends DefaultSerializeable {
    private _size;
    private _aspect;
    /**
     * The size of one dimension.
     *
     * @since 6.5.0
     */
    get size(): NumberWithUnit;
    /**
     * The aspect ratio for the other dimension.
     *
     * @since 6.5.0
     */
    get aspect(): number;
    constructor(size: NumberWithUnit, aspect: number);
}

/**
 * An enumeration of possible ways to define a rectangular size.
 *
 * @since 6.5.0
 */
declare enum SizingMode {
    /**
     * This value will use a {@link SizeWithUnit} to determine width and the height.
     *
     * @since 6.5.0
     */
    WidthAndHeight = "widthAndHeight",
    /**
     * This value will use a {@link FloatWithUnit|NumberWithUnit} to determine the width and a float multiplier to determine the height.
     *
     * @since 6.5.0
     */
    WidthAndAspectRatio = "widthAndAspectRatio",
    /**
     * This value will use a {@link FloatWithUnit|NumberWithUnit} to determine the height and a float multiplier to determine the width.
     *
     * @since 6.5.0
     */
    HeightAndAspectRatio = "heightAndAspectRatio",
    /**
     * This value will use a {@link FloatWithUnit|NumberWithUnit} to determine the rectangle length on the short side of the reference and a float multiplier to determine the length on the long side.
     *
     * @since 6.8.0
     */
    ShorterDimensionAndAspectRatio = "shorterDimensionAndAspectRatio"
}

interface SizeWithUnitAndAspectJSON {
    width?: NumberWithUnitJSON;
    height?: NumberWithUnitJSON;
    shorterDimension?: NumberWithUnitJSON;
    aspect?: number;
}
interface PrivateSizeWithUnitAndAspect {
    fromJSON(json: SizeWithUnitAndAspectJSON): SizeWithUnitAndAspect;
}
/**
 * Holds a {@link SizingMode} - and corresponding required values - to define a rectangular size.
 *
 * @since 6.5.0
 */
declare class SizeWithUnitAndAspect implements Serializeable {
    private _widthAndHeight;
    private _widthAndAspectRatio;
    private _heightAndAspectRatio;
    private _shorterDimensionAndAspectRatio;
    /**
     * The values for width and height.
     *
     * This value will always be *null* unless {@link SizeWithUnitAndAspect.sizingMode} is {@link SizingMode.WidthAndHeight}.
     *
     * @since 6.5.0
     */
    get widthAndHeight(): SizeWithUnit | null;
    /**
     * The value for width and the aspect ratio for height.
     *
     * This value will always be *null* unless {@link SizeWithUnitAndAspect.sizingMode} is {@link SizingMode.WidthAndAspectRatio}.
     *
     * @since 6.5.0
     */
    get widthAndAspectRatio(): SizeWithAspect | null;
    /**
     * The value for height and the aspect ratio for width.
     *
     * This value will always be *null* unless {@link SizeWithUnitAndAspect.sizingMode} is {@link SizingMode.HeightAndAspectRatio}.
     *
     * @since 6.5.0
     */
    get heightAndAspectRatio(): SizeWithAspect | null;
    /**
     * The value for the short dimension of the reference view and the aspect ratio for the long dimension of the reference view.
     *
     * This value will always be *null* unless {@link SizeWithUnitAndAspect.sizingMode} is {@link SizingMode.ShorterDimensionAndAspectRatio}.
     *
     * @since 6.8.0
     */
    get shorterDimensionAndAspectRatio(): SizeWithAspect | null;
    /**
     * The sizing mode.
     *
     * @since 6.5.0
     */
    get sizingMode(): SizingMode;
    private static sizeWithWidthAndHeight;
    private static sizeWithWidthAndAspectRatio;
    private static sizeWithHeightAndAspectRatio;
    private static sizeWithShorterDimensionAndAspectRatio;
    private static fromJSON;
    toJSON(): object;
}

interface MarginsWithUnitJSON {
    left: NumberWithUnitJSON;
    right: NumberWithUnitJSON;
    top: NumberWithUnitJSON;
    bottom: NumberWithUnitJSON;
}
interface PrivateMarginsWithUnit {
    readonly zero: MarginsWithUnit$1;
    fromJSON(json: MarginsWithUnitJSON): MarginsWithUnit$1;
}
/**
 * Holds margin values (left, top, right, bottom) that can each be expressed with a different measure unit.
 *
 * @since 6.5.0
 */
declare class MarginsWithUnit$1 extends DefaultSerializeable {
    private _left;
    private _right;
    private _top;
    private _bottom;
    /**
     * Left margin.
     *
     * @since 6.5.0
     */
    get left(): NumberWithUnit;
    /**
     * Right margin.
     *
     * @since 6.5.0
     */
    get right(): NumberWithUnit;
    /**
     * Top margin.
     *
     * @since 6.5.0
     */
    get top(): NumberWithUnit;
    /**
     * Bottom margin.
     *
     * @since 6.5.0
     */
    get bottom(): NumberWithUnit;
    private static fromJSON;
    private static get zero();
    constructor(left: NumberWithUnit, right: NumberWithUnit, top: NumberWithUnit, bottom: NumberWithUnit);
}

interface PrivateBrush {
    readonly copy: Brush$1;
    defaults: unknown;
    fromJSON(json: unknown): Brush$1;
    toJSON(): BrushJSON;
}
interface BrushJSON {
    fill: {
        color: Color$1;
    };
    stroke: {
        color: Color$1;
        width: number;
    };
}
/**
 * Brushes define how objects are drawn on screen and allow to change their fill and stroke color as well as the stroke width. They are, for example, used to change the styling of barcode locations, or other objects drawn on top of the video preview. Brushes are immutable. Once created none of the members can be modified.
 *
 * @since 6.5.0
 */
declare class Brush$1 extends DefaultSerializeable {
    private static defaults;
    private fill;
    private stroke;
    /**
     * Creates a new brush where both fill and stroke colors are set to fully transparent black. The stroke width is set to zero.
     *
     * @since 6.5.0
     */
    static get transparent(): Brush$1;
    /**
     * The fill color used to draw the object.
     *
     * @since 6.5.0
     */
    get fillColor(): Color$1;
    /**
     * The stroke color used to draw the object.
     *
     * @since 6.5.0
     */
    get strokeColor(): Color$1;
    /**
     * The width in device-independent pixels used to render the stroke.
     *
     * @since 6.5.0
     */
    get strokeWidth(): number;
    private get copy();
    private static fromJSON;
    /**
     * Creates a new default brush. Both fill and stroke color are set to fully transparent black. The stroke width is set to zero.
     *
     * @since 6.5.0
     */
    constructor();
    constructor(fillColor: Color$1, strokeColor: Color$1, strokeWidth: number);
}

/**
 * An enumeration of possible anchoring points in a geometric object such as {@link Quadrilateral|quadrilaterals}. Values of this enumeration are typically used to determine where elements are placed on the screen. For example, it is used to place the logo on screen.
 *
 * @since 6.5.0
 */
declare enum Anchor$1 {
    /**
     * This value will use the top left corner as the anchor point.
     *
     * @since 6.5.0
     */
    TopLeft = "topLeft",
    /**
     * This value will will use the center of the top edge as the anchor point.
     *
     * @since 6.5.0
     */
    TopCenter = "topCenter",
    /**
     * This value will use the top right corner as the anchor point.
     *
     * @since 6.5.0
     */
    TopRight = "topRight",
    /**
     * This value will use the center left corner as the anchor point.
     *
     * @since 6.5.0
     */
    CenterLeft = "centerLeft",
    /**
     * This value will use the center as the anchor point.
     *
     * @since 6.5.0
     */
    Center = "center",
    /**
     * This value will use the center of the right edge as the anchor point.
     *
     * @since 6.5.0
     */
    CenterRight = "centerRight",
    /**
     * This value will use the bottom left corner as the anchor point.
     *
     * @since 6.5.0
     */
    BottomLeft = "bottomLeft",
    /**
     * This value will use the center of the bottom edge as the anchor point.
     *
     * @since 6.5.0
     */
    BottomCenter = "bottomCenter",
    /**
     * This value will use the bottom right corner as the anchor point.
     *
     * @since 6.5.0
     */
    BottomRight = "bottomRight"
}

/** @since 6.5.0 */
declare enum Orientation {
    /** @since 6.5.0 */
    Unknown = "unknown",
    /** @since 6.5.0 */
    Portrait = "portrait",
    /** @since 6.5.0 */
    PortraitUpsideDown = "portraitUpsideDown",
    /** @since 6.5.0 */
    LandscapeRight = "landscapeRight",
    /** @since 6.5.0 */
    LandscapeLeft = "landscapeLeft"
}

/**
 * Enumeration for different directions.
 *
 * @since 6.5.0
 */
declare enum Direction {
    /**
     * No direction.
     *
     * @since 6.5.0
     */
    None = "none",
    /**
     * Direction horizontal.
     *
     * @since 6.5.0
     */
    Horizontal = "horizontal",
    /**
     * Direction left to right.
     *
     * @since 6.5.0
     */
    LeftToRight = "leftToRight",
    /**
     * Direction right to left.
     *
     * @since 6.5.0
     */
    RightToLeft = "rightToLeft",
    /**
     * Direction vertical.
     *
     * @since 6.5.0
     */
    Vertical = "vertical",
    /**
     * Direction top to bottom.
     *
     * @since 6.5.0
     */
    TopToBottom = "topToBottom",
    /**
     * Direction bottom to top.
     *
     * @since 6.5.0
     */
    BottomToTop = "bottomToTop"
}

/**
 * Allows enabling of the {@link ScanIntention.Smart} algorithm that intelligently identifies and scans the intended barcode without requiring precise aiming, eliminating the need to constantly look at the screen and reducing errors.
 *
 * @since 6.24.0
 */
declare enum ScanIntention$1 {
    /**
     * No smart algorithms for devices with poorer performance.
     *
     * @since 6.24.0
     */
    Manual = "manual",
    /**
     * On supported devices, it enables the automatic algorithm that intelligently identifies and then scans the barcode that the user intends to capture, reducing errors.
     *
     * A frame source that supplies a single image requires {@link ScanIntention.Manual}. {@link ScanIntention.Smart} has to observe a barcode across several frames before it returns it.
     *
     * @since 6.24.0
     */
    Smart = "smart",
    /**
     * Identifies candidates for scanning and then scans the barcode that the user indicates, reducing errors.
     *
     * @since 7.5.0
     * @deprecated Use SelectionMode.Auto instead. Will be removed in 9.0.
     */
    SmartSelection = "smartSelection"
}

/**
 * Controls whether the aimed-at barcode is scanned without user confirmation. Used by {@link BarcodeCaptureSettings} and {@link SparkScanSettings}.
 *
 * @since 8.5.0
 */
declare enum SelectionMode$1 {
    /**
     * Selection is never active. Barcodes are scanned automatically as soon as they are aimed at.
     *
     * @since 8.5.0
     */
    Off = "off",
    /**
     * Selection is always active. The aimed barcode is highlighted but only delivered after the user confirms it — by tapping the preview in BarcodeCapture, or by tapping the dedicated trigger button in SparkScan.
     *
     * @since 8.5.0
     */
    On = "on",
    /**
     * The SDK decides dynamically whether selection is active, based on device capabilities and scene conditions.
     *
     * This is the recommended replacement for the deprecated `ScanIntention.SmartSelection`.
     *
     * {@link SelectionMode.Auto} requires the scan intention to be set to {@link ScanIntention.Smart}; with {@link ScanIntention.Manual} it behaves like {@link SelectionMode.Off}. Automatic selection only activates on devices that support Smart.
     *
     * @since 8.5.0
     */
    Auto = "auto"
}

/** @since 6.5.0 */
declare enum CameraPosition {
    /**
     * The camera is attached at the back of the device and is facing away from the user.
     *
     * @since 6.5.0
     */
    WorldFacing = "worldFacing",
    /**
     * The camera is attached on the front of the device and facing towards the user.
     *
     * @since 6.5.0
     */
    UserFacing = "userFacing",
    /**
     * The camera position is unspecified.
     *
     * @since 6.5.0
     */
    Unspecified = "unspecified"
}

/**
 * The different states a frame source can be in.
 *
 * @since 6.5.0
 */
declare enum FrameSourceState {
    /**
     * The frame source is on and producing frames.
     *
     * @since 6.5.0
     */
    On = "on",
    /**
     * The frame source is off and not producing frames.
     *
     * @since 6.5.0
     */
    Off = "off",
    /**
     * The frame source is currently starting (moving from {@link FrameSourceState.Off} to state {@link FrameSourceState.On}). This value cannot be set directly but is returned by FrameSource.getCurrentState to indicate that the frame source is currently starting.
     *
     * @since 6.5.0
     */
    Starting = "starting",
    /**
     * The frame source is currently stopping (moving from {@link FrameSourceState.On} to state {@link FrameSourceState.Off}). This value cannot be set directly but is returned by FrameSource.getCurrentState to indicate that the frame source is currently stopping.
     *
     * @since 6.5.0
     */
    Stopping = "stopping",
    /**
     * The frame source is in standby and not producing frames.
     *
     * @since 6.6.0
     */
    Standby = "standby",
    /**
     * The frame source is currently booting up (moving from {@link FrameSourceState.Off} to state {@link FrameSourceState.Standby}). This value cannot be set directly but is returned by FrameSource.getCurrentState to indicate that the frame source is currently booting up.
     *
     * @since 6.6.0
     */
    BootingUp = "bootingUp",
    /**
     * The frame source is currently waking up (moving from {@link FrameSourceState.Standby} to state {@link FrameSourceState.On}). This value cannot be set directly but is returned by FrameSource.getCurrentState to indicate that the frame source is currently waking up.
     *
     * @since 6.6.0
     */
    WakingUp = "wakingUp",
    /**
     * The frame source is currently going to sleep (moving from {@link FrameSourceState.On} to state {@link FrameSourceState.Standby}). This value cannot be set directly but is returned by FrameSource.getCurrentState to indicate that the frame source is currently going to sleep.
     *
     * @since 6.6.0
     */
    GoingToSleep = "goingToSleep",
    /**
     * The frame source is currently shutting down (moving from {@link FrameSourceState.Standby} to state {@link FrameSourceState.Off}). This value cannot be set directly but is returned by FrameSource.getCurrentState to indicate that the frame source is currently shutting down.
     *
     * @since 6.6.0
     */
    ShuttingDown = "shuttingDown"
}

interface DidChangeSizeEventPayload {
    viewId: number;
    size: SizeJSON;
    orientation: string;
}
interface DidChangeStatusEventPayload {
    status: string;
}
interface DidChangeStateEventPayload {
    state: string;
}
interface EventPayload {
    name: string;
    data: string;
    viewId?: number;
    modeId?: number;
}
/**
 * Symbol returned by parseIfShouldHandle when an event should be skipped
 * (filtered out based on viewId/modeId mismatch).
 */
declare const SKIP: unique symbol;
declare class EventDataParser {
    private static parse;
    /**
     * Check if an event should be handled based on viewId/modeId filtering.
     * Used by React Native new architecture for pre-parse filtering to avoid
     * unnecessary JSON parsing of events not intended for this consumer.
     *
     * @param ev The event payload to check
     * @param ids Object containing optional viewId and/or modeId to match against
     * @returns true if the event should be handled, false if it should be skipped
     */
    static shouldHandle(ev: EventPayload, ids: {
        viewId?: number;
        modeId?: number;
    }): boolean;
    /**
     * Parse event data if it should be handled, otherwise return SKIP.
     *
     * Filtering is performed in two stages:
     * 1. Pre-parse: if the event wrapper carries viewId/modeId, skip parsing entirely on mismatch.
     * 2. Post-parse: verify the parsed payload's viewId/modeId matches the expected ids.
     *
     * @param ev The event payload to check and parse
     * @param ids Object containing optional viewId and/or modeId to match against
     * @returns SKIP if filtered out, null if parse failed, or parsed data
     */
    static parseIfShouldHandle<T>(ev: EventPayload, ids: {
        viewId?: number;
        modeId?: number;
    }): T | null | typeof SKIP;
}
interface NativeCallResult {
    data: string;
}
interface FrameSourceDidChangeStateEventPayload {
    state: FrameSourceState;
    cameraPosition?: CameraPosition | null;
}

interface PropertyChangeListener {
    (property: string, value: any): void;
}
declare class Observable extends DefaultSerializeable {
    private listeners;
    addListener(listener: PropertyChangeListener): void;
    removeListener(listener: PropertyChangeListener): void;
    protected notifyListeners(property: string, value: any): void;
}

declare class HtmlElementPosition {
    readonly top: number;
    readonly left: number;
    constructor(top: number, left: number);
    didChangeComparedTo(other: HtmlElementPosition | null): boolean;
}
declare class HtmlElementSize {
    readonly width: number;
    readonly height: number;
    constructor(width: number, height: number);
    didChangeComparedTo(other: HtmlElementSize | null): boolean;
}
declare class HTMLElementState {
    isShown: boolean;
    position: HtmlElementPosition | null;
    size: HtmlElementSize | null;
    shouldBeUnderContent: boolean;
    get isValid(): boolean;
    didChangeComparedTo(other: HTMLElementState | null): boolean;
}



/**
 * Listener for observing the focus gesture. This listener is typically used when you want to react to focus gestures being triggered to update UI elements or similar.
 *
 * @since 8.3.0
 */
interface FocusGestureListener {
    /**
     * Triggers a focus as if the gesture was executed.
     *
     * @since 8.3.0
     */
    didFocusGesture?(focusGesture: FocusGesture$1, point: PointWithUnit): void;
}




/**
 * Common interface for all the focus gestures.
 *
 * @since 6.7.0
 */
interface FocusGesture$1 {
    /**
     * If enabled triggering the focus gesture will also show a visual indicator. Defaults to *true*.
     *
     * @since 8.3.0
     */
    showUIIndicator: boolean;
    /**
     * Adds the listener to this gesture.
     *
     * In case the same listener is already observing this instance, calling this method will not add the listener again.
     *
     * @since 8.3.0
     */
    addListener(listener: FocusGestureListener): void;
    /**
     * Removes a previously added listener from this gesture.
     *
     * In case the listener is not currently observing this instance, calling this method has no effect.
     *
     * @since 8.3.0
     */
    removeListener(listener: FocusGestureListener): void;
    /**
     * Triggers a focus as if the focus gesture was performed.
     *
     * @since 8.3.0
     */
    triggerFocus(point: PointWithUnit): Promise<void>;
}

/**
 * Enumeration of possible focus gesture strategies to use.
 *
 * @since 6.7.0
 */
declare enum FocusGestureStrategy {
    /**
     * No effect when performing a focus gesture.
     *
     * @since 6.7.0
     */
    None = "none",
    /**
     * Focus on PoI and only change with next focus gesture.
     *
     * @since 6.7.0
     */
    Manual = "manual",
    /**
     * Focus on PoI and reset to previous focus strategy on capture.
     *
     * @since 6.7.0
     */
    ManualUntilCapture = "manualUntilCapture",
    /**
     * Continuously focus on the location of the gesture and only change with next focus gesture.
     *
     * @since 6.7.0
     */
    AutoOnLocation = "autoOnLocation"
}

/**
 * Enumeration of possible focus ranges to use. This can be used to restrict the auto-focus system to only consider objects in a certain range to focus on.
 *
 * @since 6.5.0
 */
declare enum FocusRange {
    /**
     * Use the full focus range supported by the camera.
     *
     * @since 6.5.0
     */
    Full = "full",
    /**
     * Only focus on objects that are near to the camera.
     *
     * @since 6.5.0
     */
    Near = "near",
    /**
     * Only focus on objects that are far from the camera.
     *
     * @since 6.5.0
     */
    Far = "far"
}

/**
 * Enumeration of possible logo styles shown by the {@link DataCaptureView|view} if no viewfinder that includes the logo is shown.
 *
 * @since 6.8.0
 */
declare enum LogoStyle$1 {
    /**
     * The minimal logo that reads “Scandit”.
     *
     * @since 6.8.0
     */
    Minimal = "minimal",
    /**
     * An extended logo that reads “Scanning By Scandit”.
     *
     * @since 6.8.0
     */
    Extended = "extended"
}

/**
 * Enumeration of possible macro modes to use. This can be used to allow very small codes to be scanned on supported devices.
 *
 * To determine if the current device supports macro mode use {@link Camera.isMacroModeAvailable}.
 *
 * On Android this enum and its values have no effect.
 *
 * @since 8.3.0
 */
declare enum MacroMode {
    /**
     * Automatically enable macro mode depending on focus position, zoom factor, and light level.
     *
     * @since 8.3.0
     */
    Auto = "auto",
    /**
     * Disables macro mode.
     *
     * @since 8.3.0
     */
    Off = "off",
    /**
     * Enables macro mode.
     *
     * @since 8.3.0
     */
    On = "on"
}

/** @since 6.5.0 */
declare enum VideoResolution {
    /**
     * {@link VideoResolution.Auto} will select either {@link VideoResolution.HD} or {@link VideoResolution.FullHD} based on hardware capabilities. The chosen resolution may change in future versions of the software.
     *
     * @since 6.5.0
     * @deprecated Auto is deprecated. Please use the capture mode's recommendedCameraSettings for the best results.
     */
    Auto = "auto",
    /**
     * Resolution is 1280x720.
     *
     * @since 6.5.0
     */
    HD = "hd",
    /**
     * Resolution is 1920x1080.
     *
     * @since 6.5.0
     */
    FullHD = "fullHd",
    /**
     * Resolution is 3840x2160. Please note: Usage of this resolution is not part of every license. If you encounter issues, please contact us at [support@scandit.com](mailto:support@scandit.com).
     *
     * On Android this requires camera API 2. Devices that are known to support API 2 well will automatically switch to use it when this resolution is set. Other devices will fall back to full HD.
     *
     * To make use of the automatic switch to API 2, make sure that you instantiate the camera directly with the settings instead of using Camera.applySettings().
     *
     * @since 6.5.0
     */
    UHD4K = "uhd4k"
}



/**
 * Listener for observing the zoom gesture. This listener is typically used when you want to react to zoom gestures being triggered to update UI elements or similar.
 *
 * @since 8.3.0
 */
interface ZoomGestureListener {
    /**
     * Called when a zoom in gesture is triggered.
     *
     * @since 8.3.0
     */
    didZoomInGesture?(zoomGesture: ZoomGesture$1): void;
    /**
     * Called when a zoom out gesture is triggered.
     *
     * @since 8.3.0
     */
    didZoomOutGesture?(zoomGesture: ZoomGesture$1): void;
}



/**
 * Common interface for all the zoom gestures.
 *
 * @since 6.7.0
 */
interface ZoomGesture$1 {
    /**
     * Adds the listener to this gesture.
     *
     * In case the same listener is already observing this instance, calling this method will not add the listener again.
     *
     * @since 8.3.0
     */
    addListener(listener: ZoomGestureListener): void;
    /**
     * Removes a previously added listener from this gesture.
     *
     * In case the listener is not currently observing this instance, calling this method has no effect.
     *
     * @since 8.3.0
     */
    removeListener(listener: ZoomGestureListener): void;
    /**
     * Triggers a zoom in as if the zoom in gesture was performed.
     *
     * @since 8.3.0
     */
    triggerZoomIn(): Promise<void>;
    /**
     * Triggers a zoom out as if the zoom out gesture was performed.
     *
     * @since 8.3.0
     */
    triggerZoomOut(): Promise<void>;
}
interface ZoomGestureJSON {
    type: string;
}

/**
 * The orientation of the {@link ZoomSwitchControl}.
 *
 * @since 8.4.0
 */
declare enum ZoomSwitchOrientation {
    /**
     * The control is laid out horizontally if the anchor is {@link Anchor.TopCenter} or {@link Anchor.BottomCenter}. Otherwise, the control is laid out vertically.
     *
     * @since 8.4.0
     */
    Default = "default",
    /**
     * The control is laid out horizontally.
     *
     * @since 8.4.0
     */
    Horizontal = "horizontal",
    /**
     * The control is laid out vertically.
     *
     * @since 8.4.0
     */
    Vertical = "vertical"
}

interface RectangularViewfinderAnimationJSON {
    readonly looping: boolean;
}
interface PrivateRectangularViewfinderAnimation {
    fromJSON(json: RectangularViewfinderAnimationJSON): RectangularViewfinderAnimation$1;
}
/**
 * Standard rectangular viewfinder animation made up of an appear animation as well as a looping animation following the appearance.
 *
 * @since 6.8.0
 */
declare class RectangularViewfinderAnimation$1 extends DefaultSerializeable {
    private readonly _isLooping;
    private static fromJSON;
    /**
     * Whether the looping animation should be executed.
     *
     * @since 6.8.0
     */
    get isLooping(): boolean;
    /** @since 6.8.0 */
    constructor(isLooping: boolean);
}

/**
 * The style of the lines drawn as part of the {@link RectangularViewfinder}.
 *
 * @since 6.8.0
 */
declare enum RectangularViewfinderLineStyle {
    /**
     * Draws lines with a width of 3 dips/points.
     *
     * @since 6.8.0
     */
    Light = "light",
    /**
     * Draws lines with a width of 5 dips/points.
     *
     * @since 6.8.0
     */
    Bold = "bold"
}

/**
 * The style of the {@link RectangularViewfinder}.
 *
 * @since 6.8.0
 */
declare enum RectangularViewfinderStyle {
    /**
     * New style from version 6.8 onwards with rounded corners.
     *
     * @since 6.8.0
     */
    Rounded = "rounded",
    /**
     * New style from version 6.8 onwards with square corners.
     *
     * @since 6.8.0
     */
    Square = "square"
}



























interface CameraSettingsDefaults {
    preferredResolution: VideoResolution;
    zoomFactor: number;
    focusRange: FocusRange;
    zoomGestureZoomFactor: number;
    focusGestureStrategy: FocusGestureStrategy;
    shouldPreferSmoothAutoFocus: boolean;
    manualLensPosition: number;
    focusStrategy: string;
    zoomLevels: number[];
    torchLevel: number;
    macroMode: MacroMode;
    adaptiveExposure: boolean;
    properties: {
        [key: string]: unknown;
    };
}
interface ZoomSwitchControlDefaults {
    orientation: ZoomSwitchOrientation;
    isAlwaysExpanded: boolean;
    isExpanded: boolean;
    accessibilityLabel: string;
    accessibilityHint: string;
}
interface CoreDefaults {
    Camera: {
        Settings: CameraSettingsDefaults;
        defaultPosition: CameraPosition | null;
        availablePositions: CameraPosition[];
    };
    ZoomSwitchControl: ZoomSwitchControlDefaults;
    DataCaptureView: {
        scanAreaMargins: MarginsWithUnit$1;
        pointOfInterest: PointWithUnit;
        logoAnchor: Anchor$1;
        logoOffset: PointWithUnit;
        focusGesture: FocusGesture$1 | null;
        zoomGesture: ZoomGesture$1 | null;
        zoomGestures: ZoomGesture$1[];
        logoStyle: LogoStyle$1;
        shouldShowZoomNotification?: boolean;
    };
    RectangularViewfinder: {
        defaultStyle: string;
        styles: {
            [key: string]: {
                size: SizeWithUnitAndAspect;
                color: Color$1;
                style: RectangularViewfinderStyle;
                lineStyle: RectangularViewfinderLineStyle;
                dimming: string;
                disabledDimming: string;
                animation: RectangularViewfinderAnimation$1 | null;
                disabledColor: Color$1;
            };
        };
    };
    AimerViewfinder: {
        frameColor: Color$1;
        dotColor: Color$1;
    };
    LaserlineViewfinder: {
        width: NumberWithUnit;
        enabledColor: Color$1;
        disabledColor: Color$1;
    };
    Brush: Brush$1;
    deviceID: string | null;
    /**
     * SDK version string, e.g. `8.7.0`. Dynamic (native-only) like `deviceID`, so it is absent
     * until `applyDynamicDefaults()` has merged the native residual — null before that.
     */
    Version: string | null;
}



declare function setCoreDefaultsLoader(loader: () => void): void;
declare function ensureCoreDefaults(): CoreDefaults;
declare function getCoreDefaults(): CoreDefaults;


declare function loadCoreDefaults(jsonDefaults: unknown): void;

/**
 * Assembles the nested JSON shape that parseDefaults (loadCoreDefaults.ts) expects, out of the flat
 * generated defaults, restricted to the keys that are knowable statically at build time.
 *
 * Excluded (genuinely dynamic, native-only) keys, mirroring CoreDefaults.getDynamic() on
 * Android:
 * - Version
 * - deviceID
 * - Camera.defaultPosition
 * - Camera.availablePositions
 * - ZoomSwitchControl.accessibilityLabel
 */
declare function buildStaticCoreDefaultsJson(platform: 'android' | 'ios'): unknown;

type HasId = {
    modeId: number;
} | {
    viewId: number;
};
type Target = HasId | null;
declare class ListenerRegistry {
    private static get fallbackEmitter();
    private static get subscriptions();
    private static get handlers();
    static addListener<T, L>(eventName: string, target: Target, listener: L, handlerFn: (activeListeners: L[], ev: EventPayload, data: T) => void): Promise<void>;
    static listenersFor<L>(eventName: string, target: Target): L[];
    static hasListeners(eventName: string, target: Target): boolean;
    static removeListener<L>(eventName: string, target: Target, listener: L): Promise<void>;
    private static addGlobalListener;
    private static slotFor;
    private static handleEvent;
    private static eventSource;
    private static subscribeToEvent;
    private static coreProxy;
    private static nativeAddListener;
    private static nativeRemoveListener;
    static reset(): void;
    private static unsubscribeToEvent;
}

interface ContextStatusJSON {
    code: number;
    isValid: boolean;
    message: string;
}
interface PrivateContextStatus {
    fromJSON(json: ContextStatusJSON): ContextStatus;
}
/**
 * Holds information on the current context status. This information is available to data capture context listeners (see didChangeStatus() method). The initial context status will always be Unknown (0) but change very quickly to either Success (1) or an error (2+, see below).
 *
 * @since 6.5.0
 */
declare class ContextStatus {
    private _message;
    private _code;
    private _isValid;
    private static fromJSON;
    /**
     * A human readable representation of the current context status, containing more information about potential issues. In case there are no issues ({@link ContextStatus.isValid} is *true*), the message is empty.
     *
     * @since 6.5.0
     */
    get message(): string;
    /**
     * The context status code.
     *
     * @since 6.5.0
     */
    get code(): number;
    /**
     * Whether the context is valid.
     *
     * @since 6.5.0
     */
    get isValid(): boolean;
}






/**
 * Interface for custom controls on top of the data capture view. Controls are restricted to the set of controls provided by the Scandit Data Capture SDK, it is not possible for customers to implement this interface and provide custom control implementations. This interface does not expose any methods or properties, it just serves as a tag for different controls.
 *
 * @since 6.8.0
 */
interface Control$1 {
}
interface PrivateControl {
    view: BaseDataCaptureView | null;
    anchor: Anchor$1 | null;
    offset: PointWithUnit | null;
}




/**
 * A capture mode overlay is the UI counterpart of capture modes and visualizes the recognition process in the graphical user interface. Overlays highlight objects such as identified barcodes on top of the preview. Overlays may add UI elements to guide the user, such as view finders.
 *
 * Capture mode overlays are added to a {@link DataCaptureView} through {@link DataCaptureView.addOverlay} and removed again through {@link DataCaptureView.removeOverlay}. Overlays are associated to the data capture modes they require when they are constructed.
 *
 * Overlays are restricted to the set of overlays provided by the Scandit Data Capture SDK, it is not possible for customers to implement this interface and provide custom overlays. This interface does not expose any methods or properties, it just serves as a tag for different overlays.
 *
 * @since 6.5.0
 */
interface DataCaptureOverlay extends Serializeable {
}
interface PrivateDataCaptureOverlay {
    view: BaseDataCaptureView | null;
}






/**
 * Listener for observing the data capture view. This listener is typically used when you want to react to orientation and size changes, e.g. to adjust view finder and scan area parameters.
 *
 * @since 6.5.0
 */
interface DataCaptureViewListener {
    /**
     * Invoked when the data capture view changes size or orientation.
     *
     * @since 6.5.0
     */
    didChangeSize?(view: DataCaptureView$1, size: Size, orientation: Orientation): void;
}


















/** @internal */
declare function markSingleInstancePerView(overlayClass: abstract new (...args: never[]) => DataCaptureOverlay, displayName: string): void;
/** @internal */
declare function singleInstanceOverlayName(overlay: DataCaptureOverlay): string | undefined;
/**
 * A React Native component that is the main UI view to be used together with the data capture context for applications that wish to display a video preview together with additional augmentations such as barcode locations.
 *
 * This class should generally not be subclassed, instead you can wrap it in another React Native component if necessary.
 *
 * The data capture view itself only displays the preview and shows UI elements to control the camera, such as buttons to switch torch on and off, or a button to switch between front and back facing cameras. Augmentations, such as the locations of identified barcodes are provided by individual overlays. This view will also display errors in case something goes wrong with its context, see the {@link ContextStatus} for a list of possible errors.
 *
 * Unless otherwise specified, methods and properties of this class should only be accessed from the main thread.
 *
 * DataCaptureView class component example:
 *
 * ```jsx
 * class DataCaptureViewComponent extends React.Component {
 *   state = { context: DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --') }
 *
 *   ...
 *
 *   render() {
 *     return (
 *      <DataCaptureView style={{ flex: 1 }} context={this.state.context}/>
 *     );
 *   }
 * }
 * ```
 *
 * **Related topics**: [Get Started](https://docs.scandit.com/sdks/react-native/barcode-capture/get-started), [MatrixScan Get Started](https://docs.scandit.com/sdks/react-native/matrixscan/get-started), Core Concepts <https://docs.scandit.com/core-concepts>.
 *
 * @since 6.5.0
 */
interface DataCaptureView$1 {
    /**
     * Adds the overlay to this data capture view. If the overlay is already part of this view, the call has no effect.
     *
     * @since 6.5.0
     */
    addOverlay(overlay: DataCaptureOverlay): void;
    /**
     * Removes overlay from this data capture view. If the overlay is not part of this view, the call has no effect.
     *
     * @since 6.5.0
     */
    removeOverlay(overlay: DataCaptureOverlay): void;
}
declare class BaseDataCaptureView extends DefaultSerializeable {
    viewComponent: DataCaptureView$1;
    parentId: number | null;
    overlays: DataCaptureOverlay[];
    listeners: DataCaptureViewListener[];
    private _context;
    get context(): DataCaptureContext | null;
    set context(context: DataCaptureContext | null);
    private get coreDefaults();
    private _scanAreaMargins;
    get scanAreaMargins(): MarginsWithUnit$1;
    private _viewId;
    get viewId(): number;
    private set viewId(value);
    set scanAreaMargins(newValue: MarginsWithUnit$1);
    private _pointOfInterest;
    get pointOfInterest(): PointWithUnit;
    set pointOfInterest(newValue: PointWithUnit);
    private _logoAnchor;
    get logoAnchor(): Anchor$1;
    set logoAnchor(newValue: Anchor$1);
    private _logoOffset;
    get logoOffset(): PointWithUnit;
    set logoOffset(newValue: PointWithUnit);
    private _focusGesture;
    get focusGesture(): FocusGesture$1 | null;
    set focusGesture(newValue: FocusGesture$1 | null);
    private _zoomGestures;
    get zoomGestures(): ZoomGesture$1[];
    set zoomGestures(newValue: ZoomGesture$1[]);
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    get zoomGesture(): ZoomGesture$1 | null;
    /** @deprecated Use zoomGestures instead. Will be removed in a future version. */
    set zoomGesture(newValue: ZoomGesture$1 | null);
    private _logoStyle;
    get logoStyle(): LogoStyle$1;
    set logoStyle(newValue: LogoStyle$1);
    private _shouldShowZoomNotification;
    get shouldShowZoomNotification(): boolean;
    set shouldShowZoomNotification(newValue: boolean);
    private controls;
    private controller;
    private isViewCreated;
    private viewCreationGate;
    /**
     * Resolves true once this view's native counterpart exists, false if it
     * never will (creation failed, timed out, or the view was torn down).
     *
     * Callers that arrive before creation has been kicked off park until it is,
     * bounded by VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS; once a creation cycle is in
     * flight the bound is VIEW_CREATION_TIMEOUT_MS. Reachable on Cordova/Capacitor
     * when a view method runs before connectToElement().
     *
     * @internal Not part of the documented API surface: it exists so the base
     * view's own action methods can await creation, and is public only because
     * the framework plugins reach it across package boundaries.
     */
    whenViewCreated(): Promise<boolean>;
    private get privateContext();
    static forContext(context: DataCaptureContext | null): BaseDataCaptureView;
    constructor(context: DataCaptureContext | null);
    /**
     * Adds an overlay to this view.
     *
     * Rejects when the overlay is one the native bridge can hold only one of (currently
     * `ColorFillOverlay`) and the view already has one, so the returned promise needs handling.
     */
    addOverlay(overlay: DataCaptureOverlay): Promise<void>;
    /**
     * Overlays the native bridge keys by type alone cannot be told apart once two are attached: the
     * second displaces the first in the key map, leaving an overlay that is drawn but unreachable,
     * and a later remove is a no-op. A class opts into that constraint by calling
     * `markSingleInstancePerView` at module scope.
     */
    private rejectDuplicateSingleInstanceOverlay;
    /**
     * Re-serializes the view so a mutated overlay reaches native. Overlays that are not owned by
     * a capture mode have no controller of their own, and the native overlay diff keys on
     * `type:modeId` — which never changes — so an in-place property change is invisible without this.
     *
     * @internal
     */
    overlayDidChange(overlay: DataCaptureOverlay): Promise<void>;
    removeOverlay(overlay: DataCaptureOverlay): Promise<void>;
    removeAllOverlays(): void;
    addListener(listener: DataCaptureViewListener): void;
    removeListener(listener: DataCaptureViewListener): void;
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral$1): Promise<Quadrilateral$1>;
    triggerFocus(point: PointWithUnit): Promise<void>;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
    addControl(control: Control$1): Promise<void>;
    addControlWithAnchorAndOffset(control: Control$1, anchor: Anchor$1, offset: PointWithUnit): void;
    removeControl(control: Control$1): void;
    controlUpdated(): Promise<void>;
    createNativeView(viewId: number): Promise<void>;
    private updateNativeView;
    private notifyListenersOfDidChangeSize;
    private notifyFocusGestureListeners;
    private notifyZoomGestureListeners;
    private notifyOverlaysOfViewIdChange;
    removeNativeView(): Promise<void>;
    dispose(): void;
    setFrame(frame: Rect$1, isUnderContent?: boolean): Promise<void>;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    /**
     * No-ops if native view creation never completes (it failed, timed out, or
     * the view was torn down); the gate emits a Warn in that case. There is
     * currently no public hook to detect it: `whenViewCreated()` is internal to
     * this base view, and the React Native components do not re-expose it.
     */
    show(): Promise<void>;
    private showWhenCreated;
    /**
     * No-ops if native view creation never completes (it failed, timed out, or
     * the view was torn down); the gate emits a Warn in that case. There is
     * currently no public hook to detect it: `whenViewCreated()` is internal to
     * this base view, and the React Native components do not re-expose it.
     */
    hide(): Promise<void>;
    private hideWhenCreated;
    setProperty<T>(name: string, value: T): void;
    selectZoomLevel(zoomLevel: number): Promise<number>;
}



/** @since 6.5.0 */
interface FrameSourceListener {
    /**
     * Called whenever the frame source’s FrameSource.getCurrentState changes, typically after FrameSource.switchToDesiredState(). Depending on the frame source and platform, the new state can be one of the transition values listed on {@link FrameSourceState}, such as {@link FrameSourceState.Starting} or {@link FrameSourceState.Stopping}, reported before the state the transition leads to.
     *
     * Adding a listener does not trigger this callback; read FrameSource.getCurrentState to get the state at the time the listener is added.
     *
     * @since 6.5.0
     */
    didChangeState?(frameSource: FrameSource$1, newState: FrameSourceState): void;
}





/**
 * Interface for producers of frames. Typically this interface is used through {@link Camera} which gives access to the built-in camera on React Native. For more sophisticated use cases this interface can be implemented by programmers to support other sources of frames, such as external cameras with proprietary APIs.
 *
 * The {@link FrameSource} interface is currently restricted to frame sources included in the Scandit Data Capture SDK and cannot be used to implement custom frame sources.
 *
 * @since 6.5.0
 */
interface FrameSource$1 extends Serializeable {
    /**
     * Readonly attribute for accessing the desired state. Possible states are {@link FrameSourceState.On}, {@link FrameSourceState.Off}, {@link FrameSourceState.Standby}.
     *
     * @since 6.5.0
     */
    readonly desiredState: FrameSourceState;
    /**
     * Sets the desired state of the frame source
     *
     * Possible values are {@link FrameSourceState.On}/{@link FrameSourceState.Off}. The frame source’s state needs to be switched to {@link FrameSourceState.On} for it to produce frames.
     *
     * It is not allowed to set the desired state to {@link FrameSourceState.Starting}/{@link FrameSourceState.Stopping}. These values are only used to report ongoing state transitions.
     *
     * In case the desired state is equal to the current state, calling this method has no effect. Otherwise, a call to this method initiates a state transition from the current state to the desired state.
     *
     * The state transition is asynchronous, meaning that it may not complete immediately for certain frame source implementations. When a state transition is ongoing, further changes to the desired state are delayed until the state transition completes. Only the last of the desired states will be processed; previous requested state transitions will be cancelled.
     *
     * The completion handler is invoked when the state transition finishes either on a background or on the calling thread. *True* is passed to the completion handler in case the state transition is successful, *false* if it either was cancelled or the state transition failed.
     *
     * @since 6.5.0
     */
    switchToDesiredState(desiredState: FrameSourceState): Promise<void>;
    /**
     * Readonly attribute for accessing the current state. Possible states are {@link FrameSourceState.On}, {@link FrameSourceState.Off}, {@link FrameSourceState.Standby}, {@link FrameSourceState.Starting}, {@link FrameSourceState.Stopping}, {@link FrameSourceState.BootingUp}, {@link FrameSourceState.WakingUp}, {@link FrameSourceState.GoingToSleep}, {@link FrameSourceState.ShuttingDown}.
     *
     * The current state cannot be changed directly, but is modified by switchToDesiredState().
     *
     * @since 6.5.0
     */
    getCurrentState(): Promise<FrameSourceState>;
    /**
     * Adds the listener to this frame source.
     *
     * In case the same listener is already observing this instance, calling this method will not add the listener again.
     *
     * @since 6.5.0
     */
    addListener(listener: FrameSourceListener): void;
    /**
     * Removes a previously added listener from this frame source.
     *
     * In case the listener is not currently observing this instance, calling this method has no effect.
     *
     * @since 6.5.0
     */
    removeListener(listener: FrameSourceListener): void;
}

/**
 * This class contains the license text and attributions for all third party software used by the Scandit SDK.
 *
 * @since 7.0.0
 */
declare class OpenSourceSoftwareLicenseInfo {
    private _licenseText;
    /**
     * Creates a new license info instance with the specified license text.
     *
     * @since 7.0.0
     */
    constructor(licenseText: string);
    /**
     * The license text for all third party software used by the Scandit SDK.
     *
     * @since 7.0.0
     */
    get licenseText(): string;
}

declare class BaseController<PROXY> {
    private _cachedProxy;
    protected get _proxy(): PROXY;
    dispose(): void;
    constructor(proxyName: string);
}

interface BaseProxy {
    subscribeForEvents(events: string[]): void;
    unsubscribeFromEvents(events: string[]): void;
    dispose(): void;
    eventEmitter: EventEmitter;
}

/**
 * The datacapture core module
 * Generated from schema definition.
 *
 * Single entry point interface - all operations go through $executeCore.
 * The CoreController handles method-specific logic and calls this proxy.
 * The NativeProxy automatically handles the `$` prefix for native method calls.
 */
interface CoreProxy extends BaseProxy {
    /**
     * Single entry point for all Core operations.
     * Routes to appropriate native command based on moduleName and methodName.
     *
     * @param params Object containing:
     *   - moduleName: The name of the module to execute against
     *   - methodName: The name of the method to execute
     *   - ...other parameters specific to the method
     *
     * @returns Promise resolving to the result (type depends on methodName)
     *
     * Note: This method is called with the `$` prefix ($executeCore) which is
     * automatically handled by NativeProxy to route to native implementation.
     */
    $executeCore(params: {
        moduleName: string;
        methodName: string;
        [key: string]: any;
    }): Promise<any>;
}



/**
 * Adapter class for Core operations.
 * Provides typed methods that internally call $executeCore.
 * Generated from schema definition to ensure parameter and method name consistency.
 */
declare class CoreProxyAdapter {
    private proxy;
    constructor(proxy: CoreProxy);
    /**
     * Gets the camera state for a given position
     * @param cameraPosition Camera position as JSON string
     */
    getCameraState({ cameraPosition }: {
        cameraPosition: string;
    }): Promise<FrameSourceState>;
    /**
     * Switches the camera to the desired state
     * @param stateJson Desired camera state as JSON string
     */
    switchCameraToDesiredState({ stateJson }: {
        stateJson: string;
    }): Promise<void>;
    /**
     * Checks if torch is available for the given camera position
     * @param cameraPosition Camera position as JSON string
     */
    isTorchAvailable({ cameraPosition }: {
        cameraPosition: string;
    }): Promise<boolean>;
    /**
     * Checks if macro mode is available for the current device
     */
    isMacroModeAvailable(): Promise<boolean>;
    /**
     * Registers a persistent listener for frame source state change events
     */
    registerFrameSourceListener(): Promise<void>;
    /**
     * Unregisters the frame source event listener
     */
    unregisterFrameSourceListener(): Promise<void>;
    /**
     * Adds an NV21 frame to the tracked sequence frame source with the given id
     * @param frameSourceId The id of the sequence frame source the frame is added to
     * @param width Frame width in pixels
     * @param height Frame height in pixels
     * @param frameData Base64-encoded NV21 frame bytes
     */
    addFrameToSequenceFrameSource({ frameSourceId, width, height, frameData, }: {
        frameSourceId: string;
        width: number;
        height: number;
        frameData: string;
    }): Promise<void>;
    /**
     * Returns the current state of the tracked sequence frame source with the given id
     * @param frameSourceId The id of the sequence frame source to get the state of
     */
    getSequenceFrameSourceState({ frameSourceId }: {
        frameSourceId: string;
    }): Promise<FrameSourceState>;
    /**
     * Registers a persistent listener for torch state change events
     */
    registerTorchStateListener(): Promise<void>;
    /**
     * Unregisters the torch state event listener
     */
    unregisterTorchStateListener(): Promise<void>;
    /**
     * Registers a persistent listener for zoom level change events
     */
    registerZoomLevelListener(): Promise<void>;
    /**
     * Unregisters the zoom level event listener
     */
    unregisterZoomLevelListener(): Promise<void>;
    /**
     * Selects the zoom level on the ZoomSwitchControl. Returns the actual zoom level applied.
     * @param viewId View identifier
     * @param zoomLevel Desired zoom level as a zoom factor
     */
    selectZoomLevel({ viewId, zoomLevel }: {
        viewId: number;
        zoomLevel: number;
    }): Promise<number>;
    /**
     * Registers a persistent listener for macro mode change events
     */
    registerMacroModeListener(): Promise<void>;
    /**
     * Unregisters the macro mode event listener
     */
    unregisterMacroModeListener(): Promise<void>;
    /**
     * Gets the last frame data by frame ID as JSON
     * @param frameId Unique frame identifier
     */
    getLastFrameAsJson({ frameId }: {
        frameId: string;
    }): Promise<string>;
    /**
     * Gets the last frame data by frame ID as JSON, or null if not found
     * @param frameId Unique frame identifier
     */
    getLastFrameOrNullAsJson({ frameId }: {
        frameId: string;
    }): Promise<string | null>;
    /**
     * Creates a DataCaptureContext from JSON
     * @param contextJson DataCaptureContext configuration as JSON string
     */
    createContextFromJson({ contextJson }: {
        contextJson: string;
    }): Promise<void>;
    /**
     * Updates a DataCaptureContext from JSON
     * @param contextJson Updated DataCaptureContext configuration as JSON string
     */
    updateContextFromJson({ contextJson }: {
        contextJson: string;
    }): Promise<void>;
    /**
     * Subscribes to context events with persistent listener
     */
    subscribeContextListener(): Promise<void>;
    /**
     * Unsubscribes from context events
     */
    unsubscribeContextListener(): Promise<void>;
    /**
     * Adds a mode to the DataCaptureContext
     * @param modeJson Mode configuration as JSON string
     */
    addModeToContext({ modeJson }: {
        modeJson: string;
    }): Promise<void>;
    /**
     * Removes a mode from the DataCaptureContext
     * @param modeJson Mode configuration as JSON string
     */
    removeModeFromContext({ modeJson }: {
        modeJson: string;
    }): Promise<void>;
    /**
     * Removes all modes from the DataCaptureContext
     */
    removeAllModes(): Promise<void>;
    /**
     * Gets open source software license information
     */
    getOpenSourceSoftwareLicenseInfo(): Promise<string>;
    /**
     * Disposes the DataCaptureContext and releases resources
     */
    disposeContext(): Promise<void>;
    /**
     * Converts a point from frame coordinates to view coordinates
     * @param viewId View identifier
     * @param pointJson Point in frame coordinates as JSON string
     */
    viewPointForFramePoint({ viewId, pointJson }: {
        viewId: number;
        pointJson: string;
    }): Promise<string>;
    /**
     * Converts a quadrilateral from frame coordinates to view coordinates
     * @param viewId View identifier
     * @param quadrilateralJson Quadrilateral in frame coordinates as JSON string
     */
    viewQuadrilateralForFrameQuadrilateral({ viewId, quadrilateralJson, }: {
        viewId: number;
        quadrilateralJson: string;
    }): Promise<string>;
    /**
     * Registers persistent event listener for view events
     * @param viewId View identifier
     */
    registerListenerForViewEvents({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Unregisters the view event listener
     * @param viewId View identifier
     */
    unregisterListenerForViewEvents({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Registers a persistent listener for focus gesture events
     * @param viewId View identifier
     */
    registerFocusGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Unregisters the focus gesture event listener
     * @param viewId View identifier
     */
    unregisterFocusGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Triggers a focus as if the focus gesture was performed
     * @param viewId View identifier
     * @param pointJson Point in view coordinates as JSON string
     */
    triggerFocus({ viewId, pointJson }: {
        viewId: number;
        pointJson: string;
    }): Promise<void>;
    /**
     * Triggers a zoom in gesture as if the zoom gesture was performed
     * @param viewId View identifier
     */
    triggerZoomIn({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Triggers a zoom out gesture as if the zoom gesture was performed
     * @param viewId View identifier
     */
    triggerZoomOut({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Registers a persistent listener for zoom gesture events
     * @param viewId View identifier
     */
    registerZoomGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Unregisters the zoom gesture event listener
     * @param viewId View identifier
     */
    unregisterZoomGestureListener({ viewId }: {
        viewId: number;
    }): Promise<void>;
    /**
     * Updates the DataCaptureView configuration
     * @param viewJson Updated view configuration as JSON string
     */
    updateDataCaptureView({ viewJson }: {
        viewJson: object | string;
    }): Promise<void>;
    /**
     * Emits haptic/audio feedback
     * @param feedbackJson Feedback configuration as JSON string
     */
    emitFeedback({ feedbackJson }: {
        feedbackJson: string;
    }): Promise<void>;
    /**
     * Registers a listener for an event with the global listener registry
     * @param eventName Event name
     * @param viewId View identifier the listener is scoped to
     * @param modeId Mode identifier the listener is scoped to
     */
    addListener({ eventName, viewId, modeId, }: {
        eventName: string;
        viewId?: number;
        modeId?: number;
    }): Promise<void>;
    /**
     * Removes a listener for an event from the global listener registry
     * @param eventName Event name
     * @param viewId View identifier the listener is scoped to
     * @param modeId Mode identifier the listener is scoped to
     */
    removeListener({ eventName, viewId, modeId, }: {
        eventName: string;
        viewId?: number;
        modeId?: number;
    }): Promise<void>;
}

/**
 * Severity threshold for {@link ScanditLogger}. A record is emitted when its own level is less than or equal to the configured level, and the configured level is not {@link LogLevel.Off}.
 *
 * @since 8.7.0
 */
declare enum LogLevel {
    /**
     * No records are emitted. This is the default: the logger stays silent until you call {@link ScanditLogger.setLevel}.
     *
     * @since 8.7.0
     */
    Off = 0,
    /**
     * Failures that the SDK could not recover from.
     *
     * @since 8.7.0
     */
    Error = 1,
    /**
     * Recoverable problems and misuse the SDK worked around.
     *
     * @since 8.7.0
     */
    Warn = 2,
    /**
     * Coarse-grained progress, such as a mode being created or disposed.
     *
     * @since 8.7.0
     */
    Info = 3,
    /**
     * Individual bridge calls, listener registrations and lifecycle transitions. This is the level to use when reproducing an integration problem.
     *
     * @since 8.7.0
     */
    Debug = 4,
    /**
     * The most verbose level. It adds the per-frame event callbacks, which a running scanner produces continuously.
     *
     * @since 8.7.0
     */
    Trace = 5
}

/**
 * The kind of activity a record describes.
 *
 * The category is a label. It never decides whether a record is kept: {@link LogLevel} alone does. Per-frame callbacks carry {@link LogCategory.Events} and are logged at {@link LogLevel.Trace}.
 *
 * @since 8.7.0
 */
declare enum LogCategory {
    /**
     * Calls between your JavaScript code and the native SDK, including the time each call took. Most state changes — applying settings, enabling a mode, switching the frame source — reach native over the bridge and appear here.
     *
     * @since 8.7.0
     */
    Bridge = 1,
    /**
     * Creation and disposal of modes, views and overlays.
     *
     * @since 8.7.0
     */
    Lifecycle = 2,
    /**
     * Registration and removal of listeners.
     *
     * @since 8.7.0
     */
    Listener = 4,
    /**
     * Per-frame event dispatch, such as session updates and the acknowledgement each one sends back to native. These records are logged at {@link LogLevel.Trace}, because a running scanner produces them continuously.
     *
     * @since 8.7.0
     */
    Events = 8
}

/**
 * One entry in the {@link ScanditLogger} buffer. Records are produced by the SDK; you receive them from {@link ScanditLogger.getRecentLogs} and {@link ScanditLogger.subscribe}.
 *
 * @since 8.7.0
 */
interface LogRecord {
    /**
     * When the record was produced, as milliseconds since the Unix epoch.
     *
     * @since 8.7.0
     */
    ts: number;
    /**
     * Severity of the record.
     *
     * @since 8.7.0
     */
    level: LogLevel;
    /**
     * The kind of activity the record describes.
     *
     * @since 8.7.0
     */
    category: LogCategory;
    /**
     * Where the record came from, for example `ts.bridge` for a call made from JavaScript or `android.bridge` for one reported by the native layer.
     *
     * @since 8.7.0
     */
    source: string;
    /**
     * The name of the method or event the record is about.
     *
     * @since 8.7.0
     */
    message: string;
    /**
     * Additional key/value context, such as the identifiers of the mode or view involved, and the arguments of the call. Arguments are redacted against a fixed floor.
     *
     * @since 8.7.0
     */
    fields?: Record<string, unknown>;
    /**
     * How long the call took, for records that measure one.
     *
     * @since 8.7.0
     */
    durationMs?: number;
    /**
     * The failure this record reports, if it reports one.
     *
     * @since 8.7.0
     */
    error?: LogRecordError;
}
/**
 * Error attached to a {@link LogRecord}.
 *
 * @since 8.7.0
 */
interface LogRecordError {
    /**
     * Class name of the error.
     *
     * @since 8.7.0
     */
    name: string;
    /**
     * Message carried by the error.
     *
     * @since 8.7.0
     */
    message: string;
    /**
     * Stack trace. Never set on a record the SDK stores, because it can contain file paths from your own application binary.
     *
     * @since 8.7.0
     */
    stack?: string;
}

type Subscriber = (record: LogRecord) => void;
interface LogConfig {
    level: LogLevel;
}
type ConfigListener = (config: LogConfig) => void;
/** Receives records queued for native storage; `installNativeLogReceiver` registers it. */
interface NativeSink {
    onQueued(): void;
    flush(): Promise<void>;
}
/**
 * Per-method override metadata consumed by the centralized bridge
 * interceptor (`instrumentBridgeCall`). Populated by code generation — each
 * platform package's `generated/<Interface>LogMetadata.ts` auto-registers
 * its map at module load via `ScanditLogger.registerMethodMetadata`.
 *
 * `level` is the level the method's success record is logged at (generated
 * metadata marks per-frame callbacks `Trace`); `category` labels the record.
 * Errors ignore both.
 */
interface MethodLogMetadata {
    level?: LogLevel;
    category?: LogCategory;
}
declare const REDACTED_ARG_KEYS: readonly string[];
declare const REDACTED_ARG_METHODS: readonly string[];
/**
 * Diagnostic logger for the Scandit Data Capture SDK. Every method is static; there is no instance to create and the logger is not attached to a {@link DataCaptureContext}.
 *
 * Logging is off until you raise the level. Records are written to the platform console and kept in an in-memory ring buffer you can read with {@link ScanditLogger.getRecentLogs} or observe with {@link ScanditLogger.subscribe}.
 *
 * **Privacy.** The buffer never leaves your application process. The SDK does not transmit or upload any of it, and nothing reaches Scandit unless you send it yourself. While the level is above `Off` the SDK also stores the records in your application’s private storage, from where {@link ScanditLogger.writeLogs} exports them to a file that stays until you delete it.
 *
 * Call arguments are recorded, but a fixed redaction floor is applied first: imagery, license keys, device identifiers and captured-document fields are replaced with `[redacted]`, and parser payloads are redacted wholesale. The floor cannot be changed, and error stack traces are never recorded.
 *
 * @since 8.7.0
 */
declare class ScanditLogger {
    private static _level;
    private static _buffer;
    private static _writeIdx;
    private static _count;
    private static _subscribers;
    private static _configListeners;
    private static _pendingForNative;
    private static _nativeSink;
    private static readonly _redactedArgKeys;
    private static readonly _CORRELATION_WINDOW_MS;
    private static _methodMetadata;
    /**
     * Merge per-method log metadata into the global registry. Called as a
     * module-load side effect by each platform package's generated
     * `LogMetadata.ts` barrel. Last write wins for duplicate keys.
     */
    static registerMethodMetadata(metadata: Record<string, MethodLogMetadata>): void;
    /** Lookup the metadata for a given native method name, if any. */
    static getMethodMetadata(methodName: string): MethodLogMetadata | undefined;
    private static _redactValue;
    private static _applyArgPolicy;
    private static _isRedactedArgMethod;
    private static _redactEveryValue;
    private static _applyErrorPolicy;
    /**
     * Sets the severity threshold. The default is {@link LogLevel.Off}, which disables logging entirely.
     *
     * @since 8.7.0
     */
    static setLevel(level: LogLevel): void;
    /**
     * Returns the current severity threshold.
     *
     * @since 8.7.0
     */
    static getLevel(): LogLevel;
    /**
     * Subscribe to configuration changes (`setLevel`). The callback fires immediately with the current
     * configuration when attached, then again on every subsequent change.
     * Returns an unsubscribe function.
     *
     * Used by `installNativeLogReceiver` to push the JS-side config to the
     * native singletons over the bridge. Not part of the customer-facing API.
     */
    static onConfigChange(cb: ConfigListener): () => void;
    private static _emitConfig;
    /**
     * Returns the buffered records, oldest first. This is the call to use when attaching logs to a support ticket.
     *
     * @since 8.7.0
     */
    static getRecentLogs(): LogRecord[];
    /**
     * Registers a callback invoked for every record as it is produced, and returns a function that removes it again. A callback that throws is caught and does not disturb the SDK.
     *
     * ```javascript
     * static subscribe(cb: (record: LogRecord) => void): () => void
     * ```
     *
     * ```javascript
     * const unsubscribe = ScanditLogger.subscribe(record => {
     *   console.log(ScanditLogger.format(record));
     * });
     *
     * // later
     * unsubscribe();
     * ```
     *
     * @since 8.7.0
     */
    static subscribe(cb: Subscriber): () => void;
    /**
     * Discards all buffered records.
     *
     * Also deletes the log files the SDK stored on the device while the level was above `Off`. The returned promise resolves once they are gone.
     *
     * @since 8.7.0
     */
    static clear(): Promise<void>;
    /** TS-emitted records not yet handed to native storage. Internal: used by `installNativeLogReceiver`. */
    static pendingNativeRecordCount(): number;
    /** Removes and returns every record waiting for native storage. Internal. */
    static takePendingNativeRecords(): LogRecord[];
    /** Registers (or, with `undefined`, removes) the sink that moves queued records to native storage. Internal. */
    static setNativeSink(sink: NativeSink | undefined): void;
    private static _enqueueForNative;
    /**
     * Writes the records the SDK stored on the device, oldest first, as a redacted JSON-lines file
     * and resolves with the absolute path written. Without `path` the file is
     * `scandit-debug-log.jsonl` in the application's cache directory, replaced on every call.
     *
     * An app can only write inside its own storage: pass a path under the app container on iOS
     * (Documents, Library or the temporary directory) or under `Context.getFilesDir()` /
     * `Context.getExternalFilesDir()` on Android. A relative `path` is resolved against the app's
     * documents/files directory, which is the portable way to ask for a destination.
     *
     * Rejects when no record is stored (call `setLevel` first), the SDK is not initialized yet,
     * or the destination cannot be written.
     *
     * Writes the records the SDK stored on the device, oldest first, as a redacted, human-readable JSON-lines file with a one-line header in front, and returns the absolute path written. Records from the native side and from the JavaScript side are both included.
     *
     * Without `path` the file is `scandit-debug-log.jsonl` in the application’s cache directory, replaced on every call. With a `path`, missing parent directories are created and a file already there is replaced; nothing else in the destination directory is removed.
     *
     * An app can only write inside its own storage. Pass a path under the app container on iOS (Documents, Library or the temporary directory), or under `Context.getFilesDir()` or `Context.getExternalFilesDir()` on Android — anywhere else needs the Storage Access Framework or MediaStore on Android 10 and later. A relative `path` is resolved against the app’s documents/files directory, which is the portable way to name a destination.
     *
     * Rejects if no record is stored (call {@link ScanditLogger.setLevel} first), the SDK is not initialized yet, or the destination cannot be written; the rejection carries a message saying which, except on Cordova iOS, where only the error code reaches the caller.
     *
     * Nothing is uploaded — the file is yours to keep, attach to a support mail to `support@scandit.com`, or hand to your own upload flow.
     *
     * @since 8.7.0
     */
    static writeLogs(path?: string): Promise<string>;
    /** Whether a record at `level` would be kept under the current level. */
    static isEnabled(level: LogLevel): boolean;
    static emit(level: LogLevel, category: LogCategory, source: string, message: string, fields?: Record<string, unknown>, durationMs?: number, error?: LogRecordError): void;
    /**
     * Insert a `LogRecord` produced by the native side into the local buffer.
     *
     * Applies the TS-side level gate; native already applied its per-method override.
     *
     * Skips the platform-native console sink (the native side already wrote
     * to `android.util.Log` / `os_log` / etc.).
     *
     * Best-effort correlation: when the incoming
     * record has a `durationMs`, look back for the most recent unmatched
     * `ts.bridge` record with the same method name (last segment after the
     * dot) within a 10-second window and attach a derived
     * `fields.bridgeOverheadMs = tsRoundTrip - nativeWork`.
     *
     * Notifies subscribers so live consumers see a unified TS + native
     * stream. Intended for use by `installNativeLogReceiver` and equivalent
     * platform adapters — not part of the customer-facing API.
     */
    static ingest(record: LogRecord): void;
    private static _withBridgeOverhead;
    /**
     * Renders a record as the single-line string the SDK writes to the console.
     *
     * @since 8.7.0
     */
    static format(record: LogRecord): string;
    private static formatFields;
    private static writeToNativeSink;
}

/**
 * Framework specific native calls provider
 */
interface NativeCaller {
    callFn(fnName: string, args: object | undefined | null, meta?: {
        isEventRegistration?: boolean;
    }): Promise<unknown>;
    registerEvent(evName: string, handler: (args: unknown) => Promise<void>): Promise<unknown>;
    unregisterEvent(evName: string, subscription: unknown): Promise<void>;
    eventHook(args: unknown): unknown;
}

declare class NativeProxy {
    eventEmitter: EventEmitter$1;
    protected nativeCaller: NativeCaller;
    protected eventSubscriptions: Map<string, unknown>;
    private cachedEventHandler;
    [k: string]: unknown;
    constructor(nativeCaller: NativeCaller);
    get framework(): string;
    get frameworkVersion(): string;
    subscribeForEvents(events: string[]): Promise<void>;
    unsubscribeFromEvents(events: string[]): Promise<void>;
    dispose(): Promise<void>;
    _call(fnName: string, args: object | undefined | null): Promise<unknown>;
    _callEventRegistration(fnName: string, args: object | undefined | null): Promise<any>;
    private _registerEvent;
    private _unregisterEvent;
}
declare function createNativeProxy<PROXY>(nativeCaller: NativeCaller): PROXY;



/** Instruments a proxy's bridge calls for logging; `NativeProxy` already does this at construction. Idempotent. */
declare function wrapNativeProxy(target: NativeProxy): void;



/**
 * Wire up the cross-bridge log channel: subscribe to the native-emitted
 * `ScanditLogger.batch` event and merge each incoming record into the local
 * in-memory buffer.
 *
 * Native records are inserted via `ScanditLogger.ingest` so they:
 *   • are NOT re-checked against TS-side level/category gating (native
 *     already applied its own gates);
 *   • are NOT re-written to the JS console (native already wrote them to
 *     the platform-native logger);
 *   • DO appear in `getRecentLogs()` and DO trigger `subscribe(cb)`
 *     callbacks, giving the customer one unified record stream.
 *
 * Call this once per framework, immediately after the NativeProxy is bound
 * (typically in `init*Proxy.ts`).
 *
 * Returns a teardown that detaches the BATCH_EVENT handler, the config
 * listener and the `appendLogs` sink, so the receiver can be turned off again. Calling this function more
 * than once on the same proxy is safe: the previous registration is disposed
 * first. It is NOT safe to rely on the EventEmitter to de-duplicate — it does
 * not (see `previousTeardowns`).
 */
declare function installNativeLogReceiver(proxy: BaseProxy): Promise<() => void>;
/**
 * Lazy front door for `installNativeLogReceiver`: attaches only a JS-side
 * `ScanditLogger.onConfigChange` gate (a `Set.add` plus a synchronous
 * callback — zero bridge traffic) and performs the real, bridge-crossing
 * install on the first config whose `level !== LogLevel.Off`. Every app that
 * never calls `setLevel` above `Off` never crosses the bridge for logging.
 *
 * `onConfigChange` fires synchronously on attach, so a customer who already
 * called `setLevel(Debug)` before SDK init still gets the install immediately
 * — this function does not delay that case, only the Off default.
 *
 * `onInstalled`, if given, runs once, right after the real install resolves
 * — the hook `registerCoreProxies` uses to open the Cordova-only native log
 * channel behind the same first-enable gate instead of eagerly.
 */
declare function armNativeLogReceiver(proxy: BaseProxy, onInstalled?: () => void): () => void;



/**
 * Open the persistent native→TS log-batch channel on frameworks whose bridge
 * requires an explicit `isEventRegistration: true` call before the native
 * side will deliver events at all (Cordova: `CordovaEventEmitter.emit` is a
 * no-op until `registerCallback` has run for the event name — see
 * `CordovaEventEmitter.kt`/`.swift`). RN and Capacitor don't need this: their
 * bridges deliver native events without a dedicated subscribe call.
 *
 * This stays a SEPARATE opt-in from `installNativeLogReceiver` — folding the
 * two together would add a native call on every framework, not just the ones
 * that need it.
 *
 * `registerCoreProxies` is the only caller: it runs this after
 * `installNativeLogReceiver` has attached its `ScanditLogger.batch` handler and
 * called `proxy.subscribeForEvents(...)`, so the TS-side plumbing is ready
 * before native starts delivering, and only for providers that declare
 * `requiresNativeLogChannel`.
 *
 * Never throws — a failure here must not block SDK init. Mirrors
 * `installNativeLogReceiver`'s `console.warn` handling.
 */
declare function subscribeNativeLogChannel(proxy: BaseProxy): Promise<void>;

/**
 * Per-method `LogRecord` level and category overrides for the CoreProxy
 * bridge surface. Consumed by the centralized `ScanditLogger` interceptor:
 * per-frame / per-scan callbacks log at `Trace` under their category label, so
 * they only show once the level is raised to `Trace`.
 *
 * Auto-registered as a side effect of importing this module via the
 * generated `index.ts` barrel — no customer wiring required.
 */
declare const CORE_PROXY_LOG_METADATA: Record<string, MethodLogMetadata>;

interface Context {
    components?: unknown[];
    deviceName?: string | null;
    externalId?: string;
    framework?: 'unknown' | 'native' | 'cordova' | 'xamarin' | 'xamarin-forms' | 'react-native' | 'titanium' | 'flutter' | 'capacitor' | 'pega' | 'web' | '.net';
    frameworkVersion?: string | null;
    frameSource?: FrameSource | null;
    licenseKey: string;
    modes?: Mode[];
    settings?: ContextSettings;
    view?: unknown;
}
/**
 * Interface for producers of frames. Typically this interface is used through {@link Camera} which gives access to the built-in camera on React Native. For more sophisticated use cases this interface can be implemented by programmers to support other sources of frames, such as external cameras with proprietary APIs.
 *
 * The {@link FrameSource} interface is currently restricted to frame sources included in the Scandit Data Capture SDK and cannot be used to implement custom frame sources.
 *
 * @since 6.5.0
 */
type FrameSource = Camera$1 | ImageFrameSource$1 | SequenceFrameSource$1;
/**
 * Gives access to the built-in camera on React Native. It implements the {@link FrameSource} interface, and, as such can be set as the frame source for the {@link DataCaptureContext}.
 *
 * Instances of this class are created through one of the factory methods default(), or atPosition().
 *
 * The camera is started by changing the desired state to {@link FrameSourceState.On}.
 *
 * By default, the resolution of captured frames as well as auto-focus and exposure settings are chosen such that they work best for a variety of use cases. To fine-tune recognition, the camera settings can be changed through applying new {@link CameraSettings|camera settings}.
 *
 * @since 6.5.0
 */
interface Camera$1 {
    type: 'camera';
    /**
     * The direction that the camera faces.
     *
     * @since 8.3.0
     */
    position?: 'worldFacing' | 'userFacing' | 'unspecified';
    cameraType?: 'sparkCapture' | null;
    settings?: CameraSettings$1;
}
/**
 * Holds camera-specific settings such as preferred resolution, maximum frame rate etc. The defaults are chosen such that they work for a wide variety of use cases. You may apply custom settings to further optimize scan performance for your particular use case. There is typically no need to customize the camera settings beyond changing the {@link CameraSettings.preferredResolution|preferred resolution}.
 *
 * For best performance use the camera settings returned by the capture mode you are using, e.g. {@link BarcodeCapture.createRecommendedCameraSettings}, or {@link BarcodeBatch.createRecommendedCameraSettings} etc.
 *
 * @since 6.5.0
 */
interface CameraSettings$1 {
    recommendedForMode?: string;
    /**
     * The preferred resolution to use for the camera. The camera will use the resolution that is closests to the resolution preference. For example, if only lower resolutions than the preferred resolution are available, the highest available resolution will be used.
     *
     * The resolution chosen by the camera only takes the {@link CameraSettings.preferredResolution} into account, it does not consider the resolution limit of your license key. When the device selects a resolution that is larger than what you have licensed, the data capture context will report a license status error.
     *
     * The default value is {@link VideoResolution.FullHD}.
     *
     * @since 6.5.0
     */
    preferredResolution?: 'auto' | 'hd' | 'fullHd' | 'uhd4k' | 'maxResolution' | 'quadHd';
    preferredAspectRatio?: 'auto' | 'sixteenToNine' | 'fourToThree';
    minFrameRate?: number;
    maxFrameRate?: number;
    preferredFrameRateRange?: 'highestWidest' | 'highestNarrowest';
    /**
     * The zoom factor to use for the camera. This value is a multiplier, a value of 1.0 means no zoom, while a value of 2.0 doubles the size of the image, but halves the field of view.
     *
     * Values less than 1.0 are treated as 1.0. Values greater than the maximum available zoom factor are clamped to the maximum accepted value.
     *
     * The default zoom factor is 1.0.
     *
     * @since 6.5.0
     */
    zoomFactor?: number;
    /**
     * The zoom factor to move to when the zoom in gesture was performed. This value is a multiplier, a value of 1.0 means no zoom, while a value of 2.0 doubles the size of the image, but halves the field of view. See also {@link CameraSettings.zoomFactor}.
     *
     * The default zoom factor for the zoom in gesture is 2.0.
     *
     * @since 6.7.0
     * @deprecated since 8.4
     */
    zoomGestureZoomFactor?: number;
    /**
     * The set of zoom levels available for zoom gestures and controls. Each value corresponds to a zoom factor that will be applied to the camera when zooming in our out. The camera automatically filters this list based on the camera hardware capabilities, so zoom levels unsupported by the device are omitted.
     *
     * The default value is `[1, 2]`.
     *
     * @since 8.4.0
     */
    zoomLevels?: number[];
    /**
     * The macro mode to use, if supported by the device.
     *
     * The default value is {@link MacroMode.Auto}.
     *
     * On Android this property has no effect.
     *
     * @since 8.3.0
     */
    macroMode?: 'auto' | 'off' | 'on';
    manualUntilCaptureTimeout?: number;
    /**
     * Enables adaptive exposure optimization for low-light conditions. When enabled, the camera can trade frame rate for brighter images by allowing longer exposure times. In low-light environments, the frame rate may drop from approximately 30fps to 10fps, while the maximum exposure duration increases from ~33ms to up to 100ms. In well-lit conditions, this setting has no impact on frame rate or exposure.
     *
     * This feature is particularly useful for scanning in challenging lighting conditions where image brightness is more critical than maintaining the highest frame rate.
     *
     * The default value is *false*.
     *
     * On Android this property has no effect.
     *
     * @since 8.3.0
     */
    adaptiveExposure?: boolean;
    /**
     * The torch intensity level. This value must be a number between 0.0 and 1.0. If a number outside the range is provided, either 0.0 or 1.0 will be used instead. Setting the torch level to 0.0 is equivalent to having the torch off.
     *
     * On Android this property has no effect.
     *
     * @since 8.3.0
     */
    torchLevel?: number;
    focus?: FocusSettings;
    api?: number;
    exposureTargetBias?: number;
    colorCorrection?: boolean;
    toneMappingCurve?: 'none' | 'gamma22' | 'linear' | 'srgb';
    noiseReductionMode?: 'off' | 'fast' | 'highQuality';
    edgeEnhancementMode?: 'off' | 'fast' | 'highQuality';
    regionStrategy?: 'default' | 'point' | 'spot' | 'area' | 'matchWithScanArea';
    arbitraryVideoResolution?: CameraSettingsArbitraryVideoResolution;
}
interface FocusSettings {
    range?: 'full' | 'far' | 'near';
    manualLensPosition?: number;
    shouldPreferSmoothAutoFocus?: boolean;
    focusStrategy?: 'auto' | 'onlyOnRequest' | 'forceContinuous' | 'forceRetrigger' | 'retriggerUntilScan' | 'continuousUntilNoScan';
    focusGestureStrategy?: 'none' | 'manual' | 'manualUntilCapture' | 'autoOnLocation';
}
interface CameraSettingsArbitraryVideoResolution {
    width: number;
    height: number;
}
/**
 * To emit the frame set this object as the `frame source` for the {@link DataCaptureContext} and turn it on by changing the desired state to {@link FrameSourceState.On}.
 *
 * This frame source will turn off automatically after the frame is emitted.
 *
 * The mode settings must use {@link ScanIntention.Manual}. {@link ScanIntention.Smart} has to observe a barcode across several frames before it returns it, which a frame source that emits one image and then turns off cannot provide.
 *
 * This frame source emits a *single* image and turns off again. To feed a continuous stream of frames from a camera your application owns, use {@link SequenceFrameSource} instead — see Sequence Frame Source.Creating an {@link ImageFrameSource} per frame and setting it on the {@link DataCaptureContext} every time is orders of magnitude slower on this platform: each image has to be encoded to be passed over the bridge, and setting a frame source re-serializes the whole context.
 *
 * @since 6.14.0
 */
interface ImageFrameSource$1 {
    type: 'image';
    id?: string;
    image: string;
}
/**
 * Emits frames added via {@link SequenceFrameSource.addFrame}.
 *
 * Use this class when your application, and not the Scandit Data Capture SDK, owns the camera.
 *
 * That is the case when the frames come from a framework that runs its own capture session, such as ARKit on iOS or ARCore on Android, or from a camera plugin your application configures itself.
 *
 * Register an instance of this class as the frame source via {@link DataCaptureContext.frameSource}, switch it to {@link FrameSourceState.On}, and then add the frames coming from the camera via {@link SequenceFrameSource.addFrame}. The frame source never opens, selects or configures a camera itself — it only forwards the frames you push into it.
 *
 * Frames reach the Scandit Data Capture SDK only while FrameSource.getCurrentState is {@link FrameSourceState.On} and the frame source is attached to a {@link DataCaptureContext}, which is why the state has to be switched explicitly, just as it is for {@link Camera}. A frame added before both conditions are true stays in a short internal queue and is emitted as soon as they are. If the queue fills up, the oldest frames are dropped first. Switching the frame source {@link FrameSourceState.Off} again stops processing without discarding that queue.
 *
 * Only one frame is in flight at a time — the next queued frame is emitted once the {@link DataCaptureContext} has finished with the previous one. Pushing frames faster than they can be processed therefore drops frames rather than building up latency.
 *
 * Register the frame source and switch it on **once**, outside of your frame loop, and then call {@link SequenceFrameSource.addFrame} for each frame. Do not create a frame source per frame, and do not set one on the {@link DataCaptureContext} from inside the frame loop. In particular, do not feed a continuous camera stream through {@link ImageFrameSource} — it is meant for single images and turns off after each one.On this platform both mistakes are expensive rather than merely wasteful: setting a frame source re-serializes the whole {@link DataCaptureContext}, and {@link ImageFrameSource} encodes every image it is given to pass it over the bridge. Measured on a Flutter sample at 720p, the per-frame variant cost 520 ms per frame against 21 ms for the loop below.
 *
 * @since 8.6.0
 */
interface SequenceFrameSource$1 {
    type: 'sequence';
    id?: string;
    position: 'worldFacing' | 'userFacing' | 'unspecified';
    lensPosition?: number;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.desiredState}.
     *
     * @since 8.6.0
     */
    desiredState?: 'on' | 'off' | 'standby';
}
type Mode = BarcodeCapture | BarcodeTracking | BarcodeSelection | SparkScan | LabelCapture | IdCapture | TextCapture | BarcodeFind | BarcodeAr | BarcodePick | BarcodeCount | BarcodeSequence;
/**
 * Capture mode for single barcode scanning. This capture mode uses the *barcode scanning* capability.
 *
 * Learn more on how to use barcode capture in our [Get Started](https://docs.scandit.com/sdks/react-native/barcode-capture/get-started) guide.
 *
 * For MatrixScan-based barcode capture, use {@link BarcodeBatch} instead.
 *
 * @since 6.5.0
 */
interface BarcodeCapture {
    type: 'barcodeCapture';
    /**
     * Instance of {@link BarcodeCaptureFeedback} that is used by the barcode scanner to notify users about Success and Failure events.
     *
     * The default instance of the Feedback will have both sound and vibration enabled. A default beep sound will be used for the sound.
     *
     * To change the feedback emitted, the {@link BarcodeCaptureFeedback} can be modified as shown below, or a new one can be assigned.
     *
     * ```jsx
     * const barcodeCapture = ...;
     * const feedback = BarcodeCaptureFeedback.defaultFeedback;
     * feedback.success = new Feedback(Vibration.defaultVibration, null);
     * barcodeCapture.feedback = feedback;
     * ```
     *
     * @since 6.5.0
     */
    feedback?: BarcodeCaptureFeedback;
    settings?: BarcodeCaptureSettings;
    enabled?: boolean;
    modeId?: number;
    parentId?: number | null;
    hasListeners?: boolean;
}
/**
 * Determines what feedback (vibration, sound) should be emitted when reading barcodes. The feedback is specified for each {@link BarcodeCapture} instance separately and can be changed through the {@link BarcodeCapture.feedback} property by either modifying an existing instance of this class, or by assigning a new one.
 *
 * As of now, this class only allows to configure the feedback that gets emitted when a barcode is read successfully, through the {@link BarcodeCaptureFeedback.success} property.
 *
 * See documentation on the {@link BarcodeCapture.feedback} property for usage samples.
 *
 * @since 6.5.0
 */
interface BarcodeCaptureFeedback {
    /**
     * A {@link Feedback} for a success event.
     *
     * @since 6.5.0
     */
    success?: Feedback$1;
}
/**
 * A feedback consisting of a sound and vibration, for example to be provided by a device when a code has been successfully scanned.
 *
 * @since 6.5.0
 */
interface Feedback$1 {
    /**
     * The sound to be played when a feedback is required. If *null*, no sound is played. Depending on the device’s ring mode and/or volume settings, no sound may be played even if this property is properly set to a non-*null* instance.
     *
     * @since 6.5.0
     */
    sound?: Sound$1 | null;
    /**
     * The vibration to be emitted when a feedback is required. If *null*, no vibration is emitted. This property is further influenced by the device’s ring mode: the device may not vibrate even if this property is properly set to a non-*null* instance.
     *
     * @since 6.5.0
     */
    vibration?: Vibration$1 | null;
}
/**
 * A sound, to be played for example when a code has been successfully scanned.
 *
 * @since 6.5.0
 */
interface Sound$1 {
    /**
     * The name of the resource file, including the extension.
     *
     * On iOS, the file must be added as a resource file, on Android it must be added specifically under app/src/main/assets.
     *
     * @since 6.5.0
     */
    resource?: string;
}
/**
 * A vibration, to be emitted for example when a code has been successfully scanned.
 *
 * @since 6.5.0
 */
interface Vibration$1 {
    type?: 'default' | 'selectionHaptic' | 'successHaptic' | 'impactHaptic' | 'impactHapticLight' | 'failureHaptic' | 'waveForm';
    timings?: number[];
    amplitudes?: number[];
}
/**
 * Holds all the barcode recognition related settings, such as enabled symbologies and location selection. For the settings to take effect, they must be applied to a {@link BarcodeCapture|barcode capture} instance using BarcodeCapture.applySettings().
 *
 * By default, all types of barcodes (symbologies) are disabled. To scan barcodes, you need to manually enable all the symbologies you want to scan in your application.
 *
 * The following lines of code show how to enable {@link Symbology.Code128} and apply the settings to {@link BarcodeCapture|barcode capture}.
 *
 * ```jsx
 * const settings = new BarcodeCaptureSettings();
 * settings.enableSymbology(Symbology.Code128, true);
 * barcodeCapture.applySettings(settings);
 * ```
 *
 * @since 6.5.0
 */
interface BarcodeCaptureSettings {
    /**
     * Determines the time interval in which codes with the same symbology/data are filtered out as duplicates. Use this property to change the interval or completely turn off duplicate filtering:
     *
     * - Setting this property to the special value -2 (default from SDK version 7.1.0) will result in a behavior that depends on {@link BarcodeCaptureSettings.scanIntention}. - If {@link ScanIntention.Smart} (default from 7.0), it enables the Smart Duplicate Filter algorithm that intelligently reports a duplicate when the user intends to scan it again, reducing errors and speeding up the workflow. - If {@link ScanIntention.Manual}, it acts as when setting {@link BarcodeCaptureSettings.codeDuplicateFilter} to 1.5s (check the following). This behavior applies also to the cases in which the Android device doesn’t support {@link ScanIntention.Smart}.
     * - Since SDK version 8.5, when {@link BarcodeCaptureSettings.selectionMode} is {@link SelectionMode.On} and this property is left at its smart default (-2), the filter is internally treated as 0 (filtering disabled) so the user can re-select the same barcode via the selection gesture. Setting this property to any value explicitly — including -2 — opts out of this override.
     * - Setting this property to the special value -1 means that the same code will not be reported again until the scanning has been stopped.
     *
     * - Setting this property to a value of 0 means that the same code will be reported every time it is found.
     * - Setting this property to a value larger than zero indicates the time that must pass between the same code to be reported again.
     *
     * The filtering is reset any time the capture mode is disabled ({@link DataCaptureMode.isEnabled} is set to false) as this is when the session is cleaned and restarts from zero.
     *
     * @since 6.5.0
     */
    codeDuplicateFilter?: number;
    symbologies?: SymbologySettings;
    /**
     * Defines the strategy with which to select one out of many visible barcodes. By default, this property is *null* and code selection is disabled.
     *
     * @since 6.5.0
     */
    locationSelection?: LocationSelection$1 | null;
    /**
     * The enabled {@link CompositeType|composite types}. To enable composite codes scanning it is also needed to enable the symbologies that make up the specific type of composite code through {@link BarcodeCaptureSettings.enableSymbologiesForCompositeTypes}.
     *
     * @since 6.6.0
     */
    enabledCompositeTypes?: ('a' | 'b' | 'c')[];
    arucoDictionary?: ArucoDictionary | null;
    batterySavingMode?: BatterySavingMode;
    /**
     * The battery saving mode to use with BarcodeCapture. Defaults to {@link BatterySavingMode.Auto}, to automatically enable the battery saving mode when a higher than usual consumption of the battery is detected, balancing performance and battery lifetime. Sets to {@link BatterySavingMode.Off} to revert to the standard performance.
     *
     * @since 6.26.0
     */
    batterySaving?: BatterySavingMode;
    /**
     * The scan intention algorithm to use with BarcodeCapture. Defaults to {@link ScanIntention.Smart}, enabling the automatic algorithm that intelligently identifies and then scans the barcode that the user intends to capture, reducing errors. Sets to {@link ScanIntention.Manual} to disable.
     *
     * When the deprecated `ScanIntention.SmartSelection` is used, the progress indicator drawn on scan candidates uses the stroke color of the brush set on {@link BarcodeCaptureOverlay}.
     *
     * A frame source that supplies a single image requires {@link ScanIntention.Manual}. {@link ScanIntention.Smart} has to observe a barcode across several frames before it returns it.
     *
     * While {@link BarcodeCaptureSettings.selectionMode} is set to {@link SelectionMode.On}, this property is recorded but does not take effect — the SDK forces smart selection internally so that the aimer is shown and the tap-to-confirm contract of {@link SelectionMode.On} holds. The value supplied here is remembered and applied automatically when {@link BarcodeCaptureSettings.selectionMode} leaves {@link SelectionMode.On}.
     *
     * @since 6.24.0
     */
    scanIntention?: ScanIntention;
    /**
     * Controls whether the aimed-at barcode is scanned without user confirmation. Defaults to {@link SelectionMode.Off} — barcodes are scanned automatically when aimed at. Set to {@link SelectionMode.On} to always require an explicit tap on the preview to confirm the scan.
     *
     * Set to {@link SelectionMode.Auto} to let the SDK decide dynamically.
     *
     * {@link SelectionMode.Auto} is the recommended replacement for the deprecated `ScanIntention.SmartSelection`.
     *
     * When {@link SelectionMode.On} is used, we recommend making it explicit to the user that they need to tap the preview to scan — for example via a toast message or similar UI hint.
     *
     * {@link SelectionMode.Auto} requires {@link BarcodeCaptureSettings.scanIntention} to be set to {@link ScanIntention.Smart}; with {@link ScanIntention.Manual} it behaves like {@link SelectionMode.Off}. Automatic selection only activates on devices that support Smart.
     *
     * @since 8.5.0
     */
    selectionMode?: SelectionMode;
}
/**
 * Settings specific to a particular {@link Symbology|barcode symbology}.
 *
 * Learn more on how to use symbology settings in our [Configure Barcode Symbologies](https://docs.scandit.com/sdks/react-native/barcode-capture/configure-barcode-symbologies) guide.
 *
 * @since 6.5.0
 */
type SymbologySettings = unknown;
/**
 * Interface for location selection. Location selections implement a specific strategy how a data object (like a barcode or text) is selected out of multiple visible ones by for example only selecting objects inside a certain area or objects that intersect a certain area. Implementations are provided by {@link RadiusLocationSelection} and {@link RectangularLocationSelection}.
 *
 * Location selection implementations are restricted to the set of location selections provided by the Scandit Data Capture SDK, it is not possible to implement this interface with a custom implementations of location selection. This interface does not expose any methods or properties, it just serves as a unifying type for different selection strategies.
 *
 * @since 6.5.0
 */
type LocationSelection$1 = NoLocationSelection | RadiusLocationSelection$1 | RectangularLocationSelection$1;
interface NoLocationSelection {
    type: 'none';
}
/**
 * Location selection for selecting codes inside a circle with the given radius, centered on the {@link DataCaptureView.pointOfInterest|point of interest}. Any object that touches the circle is returned, objects that do not intersect the circle are filtered out.
 *
 * @since 6.5.0
 */
interface RadiusLocationSelection$1 {
    type: 'radius';
    /**
     * The radius of the circle. When using fractional coordinates, the radius is measured relative to the view’s width.
     *
     * @since 6.5.0
     */
    radius: UIValue;
}
interface UIValue {
    value?: number;
    unit?: 'fraction' | 'pixel' | 'dip';
}
/**
 * Location selection for selecting codes inside a rectangle centered on the {@link DataCaptureView.pointOfInterest|point of interest}. Any object that is fully inside the rectangle is returned, objects that are partially or entirely outside of the rectangle are filtered out.
 *
 * @since 6.5.0
 */
interface RectangularLocationSelection$1 {
    type: 'rectangular';
    size: UIAspectSize;
}
interface UIAspectSize {
    width?: UIValue;
    height?: UIValue;
    shorterDimension?: UIValue;
    aspect?: number;
}
/** @since 6.19.0 */
interface ArucoDictionary {
    preset?: '4X4_250' | '5X5_50' | '5X5_100' | '5X5_250' | '5X5_1000' | '5X5_1023' | '6X6_250';
    markerSize?: number;
    markers?: ArucoMarker[];
}
/** @since 6.19.0 */
interface ArucoMarker {
    markerSize?: number;
    markerData?: string;
}
/**
 * A feature that can help you extend the battery life of your phone when you are running low on power. It reduces some of the functions and features that consume more energy.
 *
 * @since 6.21.0
 */
type BatterySavingMode = 'on' | 'off' | 'auto';
/**
 * Allows enabling of the {@link ScanIntention.Smart} algorithm that intelligently identifies and scans the intended barcode without requiring precise aiming, eliminating the need to constantly look at the screen and reducing errors.
 *
 * @since 6.24.0
 */
type ScanIntention = 'manual' | 'smart' | 'smartSelection';
/**
 * Controls whether the aimed-at barcode is scanned without user confirmation. Used by {@link BarcodeCaptureSettings} and {@link SparkScanSettings}.
 *
 * @since 8.5.0
 */
type SelectionMode = 'off' | 'on' | 'auto';
interface BarcodeTracking {
    type: 'barcodeTracking';
    settings?: BarcodeTrackingSettings;
    enabled?: boolean;
    modeId?: number;
    hasListeners?: boolean;
    parentId?: number | null;
}
interface BarcodeTrackingSettings {
    /** @deprecated since 6.26 */
    scenario?: string;
    symbologies?: SymbologySettings;
    expectOnlyUniqueBarcodes?: boolean;
    arucoDictionary?: ArucoDictionary | null;
}
/**
 * Data capture mode that implements barcode selection.
 *
 * Learn more on how to use Barcode Selection in our [Get Started](https://docs.scandit.com/sdks/react-native/barcode-selection/get-started) guide.
 *
 * @since 6.10.0
 */
interface BarcodeSelection {
    type: 'barcodeSelection';
    /**
     * Instance of {@link BarcodeSelectionFeedback} that is used by barcode selection to notify users about the selection of a barcode.
     *
     * The default instance of the Feedback will have the sound enabled but no vibration. A default click tone will be used for the sound.
     *
     * To change the feedback emitted, the {@link BarcodeSelectionFeedback} can be modified as shown below, or a new one can be assigned.
     *
     * ```jsx
     * const barcodeSelection = ...;
     * const feedback = BarcodeSelectionFeedback.defaultFeedback;
     * feedback.success = new Feedback(Vibration.defaultVibration, null);
     * barcodeSelection.feedback = feedback;
     * ```
     *
     * @since 6.10.0
     */
    feedback?: BarcodeSelectionFeedback;
    settings?: BarcodeSelectionSettings;
    enabled?: boolean;
    /**
     * The point of interest overwriting the {@link DataCaptureView.pointOfInterest|point of interest of the data capture view}. By default, this overwriting point of interest is not set and the one from the data capture view is used.
     *
     * @since 6.10.0
     */
    pointOfInterest?: UIPoint | null;
    modeId?: number;
    parentId?: number | null;
    hasListeners?: boolean;
}
/**
 * Determines what feedback (vibration, sound) should be emitted when reading barcodes. The feedback is specified for each {@link BarcodeSelection} instance separately and can be changed through the {@link BarcodeSelection.feedback} property by either modifying an existing instance of this class, or by assigning a new one.As of now, this class only allows to configure the feedback that gets emitted when a barcode is selected, through the {@link BarcodeSelectionFeedback.selection} property.See documentation on the {@link BarcodeSelection.feedback} property for usage samples.
 *
 * @since 6.10.0
 */
interface BarcodeSelectionFeedback {
    /**
     * A {@link Feedback} for a selection event.
     *
     * @since 6.10.0
     */
    selection?: Feedback$1;
}
/**
 * Holds all the barcode selection related settings, such as enabled symbologies and tap behavior. For the settings to take effect, they must be applied to a {@link BarcodeSelection|barcode selection} instance using BarcodeSelection.applySettings().
 *
 * @since 6.10.0
 */
interface BarcodeSelectionSettings {
    symbologies?: SymbologySettings;
    /**
     * This setting is used to define the method that {@link BarcodeSelection} will use to select barcodes. Defaults to {@link BarcodeSelectionTapSelection}.
     *
     * @since 6.10.0
     */
    selectionType?: SelectionType;
    singleBarcodeAutoDetectionEnabled?: boolean;
    /**
     * Determines the time interval in which codes with the same symbology/data are considered not automatically selectable again (automatic selection can happen through {@link BarcodeSelectionSettings.singleBarcodeAutoDetection}). By default, when the same code (data, symbology) stays in view after just having been selected (manually or automatically) it will not be automatically selected again for 500 milliseconds. This property has no influence on manual selection by tapping. Use this property to change the interval or completely turn off duplicate filtering:
     *
     * - Setting this property to value smaller than zero, means that the same code will not be automatically selectable again until the selection has been stopped.
     * - Setting this property to a value of zero means that the same code will be automatically selectable again immediately. In use cases that includes automatic selection this is likely never wanted.
     * - Setting this property to a value larger than zero indicates the time that must pass between the same code to be automatically selected again.
     *
     * @since 6.10.0
     */
    codeDuplicateFilter?: number;
    /**
     * If false, selection through tap is disabled. Defaults to *true*. This property only has its effect when used with manual aimer selection.
     *
     * @since 8.6.0
     */
    tapGestureForSelectionEnabled?: boolean;
    swipeGesturesEnabled?: boolean;
}
type SelectionType = TapSelection | AimerSelection;
interface TapSelection {
    type: 'tapSelection';
    tapBehavior?: 'toggleSelection' | 'repeatSelection';
    freezeBehavior?: 'manual' | 'manualAndAutomatic';
    shouldFreezeOnDoubleTap?: boolean;
}
interface AimerSelection {
    type: 'aimerSelection';
    selectionStrategy?: SelectionStrategy;
    aimerBehavior?: 'toggleSelection' | 'repeatSelection';
}
type SelectionStrategy = ManualSelectionStrategy | AutoSelectionStrategy;
interface ManualSelectionStrategy {
    type: 'manualSelectionStrategy';
}
interface AutoSelectionStrategy {
    type: 'autoSelectionStrategy';
}
interface UIPoint {
    x: UIValue;
    y: UIValue;
}
/**
 * Capture mode that implements SparkScan.
 *
 * This capture mode uses the *barcode scanning* capability. It cannot be used together with other capture modes that require the same capabilities, e.g. {@link BarcodeCapture}.
 *
 * @since 6.16.0
 */
interface SparkScan {
    type: 'sparkScan';
    settings?: SparkScanSettings;
    /**
     * This flag indicates whether the SparkScan mode is currently processing frames to recognise barcodes.
     *
     * Changing this property from *false* to *true* causes the connected {@link SparkScanView} to start its scanning flow.
     *
     * Changing this property from *true* to *false* causes the connected {@link SparkScanView} to stop its scanning flow and go to idle mode.
     *
     * @since 6.16.0
     */
    isEnabled?: boolean;
    hasListeners?: boolean;
}
/**
 * Holds all the SparkScan settings, such as enabled symbologies and scan intention.
 *
 * For the settings to take effect, they must be applied to a {@link SparkScan} instance using SparkScan.applySettings().
 *
 * By default, all types of barcodes (symbologies) are disabled. To scan barcodes, you need to manually enable all the symbologies you want to scan in your application.
 *
 * The following lines of code show how to enable {@link Symbology.Code128} and apply the settings to {@link SparkScan}.
 *
 * ```jsx
 * const settings = new SparkScanSettings();
 * settings.enableSymbology(Symbology.Code128, true);
 * sparkScan.applySettings(settings);
 * ```
 *
 * @since 6.16.0
 */
interface SparkScanSettings {
    /**
     * Determines the time interval in which codes with the same symbology/data are filtered out as duplicates. Use this property to change the interval or completely turn off duplicate filtering:
     *
     * - Setting this property to the special value -2 (default from SDK version 7.1.0) will result in a behavior that depends on {@link SparkScanSettings.scanIntention}. - If {@link ScanIntention.Smart} (default from 8.1), it enables the Smart Duplicate Filter algorithm that intelligently reports a duplicate when the user intends to scan it again, reducing errors and speeding up the workflow. - If {@link ScanIntention.Manual}, it acts as when setting {@link SparkScanSettings.codeDuplicateFilter} to 1.5s (check the following). This behavior applies also to the cases in which the Android device doesn’t support {@link ScanIntention.Smart}.
     * - Since SDK version 8.5, when {@link SparkScanSettings.selectionMode} is {@link SelectionMode.On} and this property is left at its smart default (-2), the filter is internally treated as 0 (filtering disabled) so the user can re-select the same barcode via the selection gesture. Setting this property to any value explicitly — including -2 — opts out of this override.
     * - Setting this property to the special value -1 means that the same code will not be reported again until the scanning has been stopped.
     *
     * - Setting this property to a value of 0 means that the same code will be reported every time it is found.
     * - Setting this property to a value larger than zero indicates the time that must pass between the same code to be reported again.
     *
     * @since 6.16.0
     */
    codeDuplicateFilter?: number;
    properties?: unknown;
    symbologies?: unknown;
    /**
     * Defines the strategy with which to select one out of many visible barcodes. By default, this property is *null* and code selection is disabled.
     *
     * @since 6.16.0
     * @deprecated since 6.19
     */
    locationSelection?: LocationSelection$1;
    /**
     * The battery saving mode to use with SparkScan. Default to {@link BatterySavingMode.Auto}, automatically enabling the battery saving mode when a higher than usual consumption of the battery is detected, balancing performance and battery lifetime.
     *
     * @since 6.21.0
     */
    batterySaving?: BatterySavingMode;
    /**
     * The scan intention algorithm to use with SparkScan. Defaults to {@link ScanIntention.Smart}. Setting this property to `ScanIntention.SmartSelection` is deprecated in 8.5 and will be removed in a future release; the smart-selection behavior will be exposed through a `SelectionMode.Auto` setting on `SparkScanSettings` in a future framework release.
     *
     * While {@link SparkScanSettings.selectionMode} is set to {@link SelectionMode.On}, this property is recorded but does not take effect — the SDK forces smart selection internally so that the aimer is shown and the tap-to-confirm contract of {@link SelectionMode.On} holds. The value supplied here is remembered and applied automatically when {@link SparkScanSettings.selectionMode} leaves {@link SelectionMode.On}.
     *
     * @since 6.24.0
     */
    scanIntention?: ScanIntention;
    /**
     * Controls whether the aimed-at barcode is scanned without user confirmation. Defaults to {@link SelectionMode.Auto}, letting the SDK decide dynamically — the recommended replacement for the deprecated `ScanIntention.SmartSelection`.
     *
     * Set to {@link SelectionMode.Off} to scan barcodes automatically as soon as they are aimed at. Set to {@link SelectionMode.On} to always require an explicit tap on the SparkScan trigger button to confirm the scan.
     *
     * {@link SelectionMode.Auto} requires {@link SparkScanSettings.scanIntention} to be set to {@link ScanIntention.Smart}; with {@link ScanIntention.Manual} it behaves like {@link SelectionMode.Off}. Automatic selection only activates on devices that support Smart.
     *
     * When {@link SelectionMode.On} is active, the hold-to-scan gesture on the trigger button is automatically disabled by the SDK — continuous scanning would contradict the explicit-confirmation contract of Selection On. {@link SparkScanViewSettings.holdToScanEnabled} is ignored in this mode and integrators do not need to disable it themselves.
     *
     * @since 8.5.0
     */
    selectionMode?: SelectionMode;
    /**
     * The enabled {@link CompositeType|composite types}. To enable composite codes scanning it is also needed to enable the symbologies that make up the specific type of composite code through {@link SparkScanSettings.enableSymbologiesForCompositeTypes}.
     *
     * @since 8.3.0
     */
    enabledCompositeTypes?: CompositeFlag[];
    scanItemDefinitions?: unknown | null;
}
/**
 * Indicates whether the code is part of a composite code.
 *
 * @since 6.5.0
 */
type CompositeFlag = 'none' | 'unknown' | 'linked' | 'gs1TypeA' | 'gs1TypeB' | 'gs1TypeC';
/**
 * Smart Label Capture enables simultaneous scanning of multiple barcodes and printed text on labels, streamlining data entry and reducing errors. This data capture mode combines barcode recognition with OCR to extract contextually relevant data fields from labels with structured layouts.
 *
 * Smart Label Capture intelligently identifies label information using multiple recognition approaches:
 *
 * - **Content analysis** of texts and barcodes for validation
 * - **Barcode symbology** detection for field identification
 * - **Relative field positioning** within the label layout
 * - **Textual context** to understand field relationships
 *
 * Primary use cases include:
 *
 * - **Retail product scanning** with price verification
 * - **Smart device label scanning** for IMEI and serial numbers
 * - **Shelf price label verification** for retail operations
 * - **Vehicle identification number (VIN) capture** from automotive labels
 *
 * Unlike {@link BarcodeCapture} which focuses on individual barcodes, Smart Label Capture provides contextual intelligence to extract multiple data types simultaneously and supports flexible field definitions for diverse label layouts.
 *
 * The key components of Label Capture are:
 *
 * - **Label Definitions**: Define the structure and expected fields of labels
 * - **Field Definitions**: - Define individual data fields (barcodes, text, dates, etc.)
 * - **Captured Labels**: - Represent successfully scanned labels with all their field data
 *
 * Label Capture can track labels across multiple frames, allowing for progressive scanning where fields are captured over time until the complete label is assembled.
 *
 * It cannot be used together with other capture modes that require the same capabilities, e.g. {@link BarcodeCapture} or {@link BarcodeBatch}.
 *
 * @since 6.5.0
 */
interface LabelCapture {
    type: 'labelCapture';
    settings?: LabelCaptureSettings;
    enabled?: boolean;
    /**
     * Instance of {@link LabelCaptureFeedback} that is used to configure the vibration and sound to be used when a label is captured.
     *
     * The default feedback will have both sound and vibration enabled. The default beep sound will be used for the sound feedback.
     *
     * @since 7.6.0
     */
    feedback?: LabelCaptureFeedback;
    modeId?: number;
    parentId?: number | null;
    hasListeners?: boolean;
}
/**
 * Configures label capture parameters and defines the structure of labels to be captured. This settings object is central to the Smart Label Capture workflow, specifying which label definitions to use, recognition parameters, and capture behavior.
 *
 * Key configuration aspects:
 *
 * - **Label definitions** - Defines field types (barcodes, dates, text) and their validation rules
 * - **Recognition parameters** - Controls scanning behavior and accuracy
 * - **Location selection** - Specifies scanning areas and constraints
 * - **Symbology settings** - Configures which barcode types are enabled
 *
 * The settings follow a fluent builder pattern for convenient configuration and support multiple label definitions to handle different types of labels in the same scanning session. For the settings to take effect, they must be applied to a {@link LabelCapture|label capture} instance using the appropriate apply settings method. The same holds for settings already applied: changes made to them afterwards take effect only once the settings are applied again.
 *
 * @since 6.5.0
 */
interface LabelCaptureSettings {
    /**
     * Defines the strategy with which to select one out of many visible labels. By default, this property is *null* and label selection is disabled.
     *
     * Currently only {@link RectangularLocationSelection} is supported.
     *
     * @since 8.6.0
     */
    locationSelection?: LocationSelection$1 | null;
    labelDefinitions?: LabelDefinition[];
    languages?: ('en' | 'es')[];
    properties?: unknown;
}
/**
 * A configuration that defines labels and their relevant fields for Smart Label Capture to recognize and extract during scans. Label definitions provide flexible data extraction from specific label layouts without custom coding, enabling structured data extraction from diverse label types.
 *
 * Label definitions support two primary approaches:
 *
 * - **Pre-built Labels** - Includes predefined configurations for common label types (price labels, VIN labels, 7-segment displays)
 * - **Custom Labels** - Allows creating unique label definitions using custom barcode and text fields
 *
 * Key configuration options for custom fields:
 *
 * - **valueRegexes** - Regular expressions to identify target strings
 * - **anchorRegexes** - Context-identifying keywords for field recognition
 * - **symbologies** - Specific barcode types to match
 * - **isOptional** - Determines field requirement status
 *
 * Pre-built field categories include:
 *
 * - **Barcode Fields** - Serial number, part number, IMEI
 * - **Price/Weight Fields** - Unit price, total price, weight
 * - **Date/Text Fields** - Packing date, expiry date
 *
 * You can create label definitions in three ways:
 *
 * - **Factory Methods** - Use predefined definitions like PriceCaptureDefinitionWithName for common use cases
 * - **Manual Construction** - Create with explicit field lists creating a new {@link LabelDefinition} object and adding fields with {@link LabelDefinition.fields}
 *
 * @since 6.22.0
 */
interface LabelDefinition {
    /**
     * The name of the label definition.
     *
     * @since 6.22.0
     */
    name: string;
    type?: 'vin' | 'priceCapture' | 'sevenSegment';
    /**
     * The fields of the label definition.
     *
     * @since 6.22.0
     */
    fields?: LabelFieldDefinition[];
    /**
     * Controls whether the **Adaptive Recognition Engine** is enabled for this label definition. The **Adaptive Recognition Engine** helps making Smart Label Capture more robust and scalable thanks to its larger, more capable model hosted in the cloud. Whenever Smart Label Capture’s on-device model fails to capture data, the SDK will automatically trigger the **Adaptive Recognition Engine** to capture complex, unforeseen data capture and process it with high accuracy and reliability. See {@link AdaptiveRecognitionMode} for available options. Defaults to {@link AdaptiveRecognitionMode.Off}.
     *
     * @since 8.3.0
     */
    adaptiveRecognitionMode?: 'off' | 'auto' | 'on';
}
/**
 * Base class for defining fields within a label. Label field definitions specify the expected content, validation regexes, and constraints for individual data elements that make up a label structure.
 *
 * Field definitions are used within {@link LabelDefinition} objects to describe the composition of labels, including what types of data to expect (barcodes, text, dates) and how to validate that data.
 *
 * @since 6.22.0
 */
type LabelFieldDefinition = ImeiOneBarcodeFieldDefinition | ImeiTwoBarcodeFieldDefinition | PartNumberBarcodeFieldDefinition | SerialNumberBarcodeFieldDefinition | ExpiryDateTextFieldDefinition | PackingDateTextFieldDefinition | TotalPriceTextFieldDefinition | UnitPriceTextFieldDefinition | WeightTextFieldDefinition | CustomBarcodeLabelFieldDefinition | CustomTextLabelFieldDefinition | DateTextFieldDefinition;
interface ImeiOneBarcodeFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'imeiOneBarcode';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
    symbologies?: SymbologySettings;
}
interface ImeiTwoBarcodeFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'imeiTwoBarcode';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
    symbologies?: SymbologySettings;
}
interface PartNumberBarcodeFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'partNumberBarcode';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
    symbologies?: SymbologySettings;
}
interface SerialNumberBarcodeFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'serialNumberBarcode';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
    symbologies?: SymbologySettings;
}
interface ExpiryDateTextFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    labelDateFormat?: LabelDateFormat;
    fieldType: 'expiryDateText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
}
/**
 * Defines the expected format for parsing dates from captured text fields. This class specifies how date components (day, month, year) are ordered and whether partial dates should be accepted during the parsing process.
 *
 * Used in conjunction with date text fields like {@link ExpiryDateText} and {@link PackingDateText} to ensure accurate date recognition and parsing.
 *
 * @since 7.2.0
 */
interface LabelDateFormat {
    /**
     * Holds the expected order for the date components. Defaults to {@link LabelDateComponentFormat.YMD}.
     *
     * @since 7.2.0
     */
    componentFormat: 'dmy' | 'mdy' | 'ymd';
    /**
     * Whether or not to accept partial dates corresponding to the specified component format. Defaults to *true*.
     *
     * @since 7.2.0
     */
    acceptPartialDates?: boolean;
}
interface PackingDateTextFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    labelDateFormat?: LabelDateFormat;
    fieldType: 'packingDateText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
}
interface TotalPriceTextFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'totalPriceText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
}
interface UnitPriceTextFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'unitPriceText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
}
interface WeightTextFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'weightText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
}
interface CustomBarcodeLabelFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'customBarcode';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
    location?: LabelFieldLocation;
    symbologies?: SymbologySettings;
}
/**
 * Defines the expected location of a field within a label. This class allows you to specify either exact coordinates or predefined relative positions where a field should be searched for during label capture.
 *
 * Field locations help constrain the search area and improve recognition accuracy by focusing the capture engine on specific regions of the label.
 *
 * @since 6.22.0
 */
interface LabelFieldLocation {
    type?: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'top' | 'right' | 'bottom' | 'left' | 'center' | 'wholeLabel';
    rect?: Rect;
}
/** @since 6.5.0 */
interface Rect {
    /**
     * The origin (top-left corner) of the rectangle.
     *
     * @since 6.5.0
     */
    origin: RectOrigin;
    /**
     * The size of the rectangle.
     *
     * @since 6.5.0
     */
    size: RectSize;
}
interface RectOrigin {
    x: number;
    y: number;
}
interface RectSize {
    width: number;
    height: number;
}
interface CustomTextLabelFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    fieldType: 'customText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
    location?: LabelFieldLocation;
}
interface DateTextFieldDefinition {
    name: string;
    number_of_mandatory_instances?: number | null;
    labelDateFormat?: LabelDateFormat;
    fieldType: 'dateText';
    optional?: boolean;
    dataTypePatterns?: string[] | null;
    patterns?: string[] | null;
}
/**
 * Determines what feedback (vibration, sound) should be emitted when capturing labels. The feedback is specified for each {@link LabelCapture} instance separately and can be changed through the {@link LabelCapture.feedback} property by either modifying an existing instance of this class, or by assigning a new one.
 *
 * As of now, this class only allows to configure the feedback that gets emitted when a label is captured successfully, through the {@link LabelCaptureFeedback.success} property.
 *
 * See documentation on the {@link LabelCapture.feedback} property for usage samples.
 *
 * @since 7.6.0
 */
interface LabelCaptureFeedback {
    /**
     * A {@link Feedback} for a success event.
     *
     * @since 7.6.0
     */
    success?: Feedback$1;
}
/** @since 6.8.0 */
interface IdCapture {
    type: 'idCapture';
    settings?: IdCaptureSettings;
    enabled?: boolean;
    /**
     * Instance of {@link IdCaptureFeedback}, determines what feedback (vibration, sound) should be emitted during the ID Capture process.
     *
     * @since 6.21.0
     */
    feedback?: IdCaptureFeedback;
    /**
     * Sets or retrieves an external transaction ID. This ID is attached to ID scan analytics data, to be linkable to customer transactions. Set to *null* to clear the transaction ID.
     *
     * @since 8.0.0
     */
    externalTransactionId?: string | null;
    modeId?: number;
    parentId?: number | null;
    hasListeners?: boolean;
}
/**
 * Settings to configure an {@link IdCapture} instance.
 *
 * @since 6.8.0
 */
interface IdCaptureSettings {
    imageToResult?: ImageToResultSettings;
    /**
     * When enabled, this setting removes protected data from images and result fields of certain document types. Enabling anonymization helps to remain compliant with local legal requirements which restrict the collection of some data. Examples of affected fields are the document number on German IDs or the personal ID number on Dutch driver’s licenses. By default set to {@link IdAnonymizationMode.FieldsOnly}.
     *
     * @since 6.17.0
     */
    anonymizationMode?: 'none' | 'fieldsOnly' | 'imagesOnly' | 'fieldsAndImages';
    /**
     * This setting enables rejection of voided documents. This feature has been primarily developed for US Driver’s Licenses, the results might not be accurate when scanning other document types.
     *
     * @since 6.25.0
     */
    rejectVoidedIds?: boolean;
    /**
     * Enables rejection of expired documents. When enabled, expired documents are routed to IdCaptureListener.didRejectId() with {@link RejectionReason.DocumentExpired} instead of being reported as captured.
     *
     * @since 7.6.0
     */
    rejectExpiredIds?: boolean;
    /**
     * Enables rejection of documents with a forged AAMVA barcode. When enabled, forged documents are routed to IdCaptureListener.didRejectId() with {@link RejectionReason.ForgedAamvaBarcode}. Verification is performed automatically by the SDK — no separate verifier object is required on iOS.
     *
     * @since 7.6.0
     */
    rejectForgedAamvaBarcodes?: boolean;
    /**
     * Enables rejection of documents that are not REAL ID compliant.
     *
     * @since 7.6.0
     */
    rejectNotRealIdCompliant?: boolean;
    /**
     * Enables rejection of documents with inconsistent data between zones (e.g., barcode vs. VIZ). When enabled, inconsistent documents are routed to IdCaptureListener.didRejectId() with {@link RejectionReason.InconsistentData}.
     *
     * The detailed result, including a front review image, is accessible via {@link CapturedId.verificationResult}. See also {@link IdCaptureSettings.setShouldPassImageTypeToResult}.
     *
     * @since 7.6.0
     */
    rejectInconsistentData?: boolean;
    /**
     * Enables rejection of documents whose holder is below the specified age. When set, underage documents are routed to IdCaptureListener.didRejectId() with {@link RejectionReason.HolderUnderage}.
     *
     * @since 7.6.0
     */
    rejectHolderBelowAge?: number | null;
    /**
     * Enables rejection of passports whose {@link PassportType} is in the given set. The sub-type is derived from the machine-readable zone, so this applies to documents scanned with an MRZ. Matching documents are routed to IdCaptureListener.didRejectId() with {@link RejectionReason.NotAcceptedDocumentType}. Empty by default, which rejects nothing. A passport whose type cannot be determined reliably is reported as `Unknown`, and is rejected only if that value is in the set. See {@link PassportType} for the rules.
     *
     * @since 8.7.0
     */
    rejectPassportTypes?: ('national' | 'emergency' | 'diplomatic' | 'official' | 'refugee' | 'alien' | 'stateless' | 'laissezPasser' | 'military' | 'seafarer' | 'emergencyTravelDocument' | 'unknown')[];
    /**
     * Enables rejection of documents that will expire within the specified duration. The duration components are applied on the date of expiry in the following order: years, months and days. Enabling this setting automatically enables the rejection of expired IDs.
     *
     * @since 7.6.0
     */
    rejectIdsExpiringIn?: Duration | null;
    /**
     * This setting enables the extraction of additional data about vehicle categories from the back of European driver’s licenses, like issue and expiry dates.
     *
     * @since 7.0.0
     */
    decodeBackOfEuropeanDrivingLicense?: boolean;
    /**
     * Documents that should be accepted by the ID Capture scanner. You may accept individual document categories (like ID cards or passports) globally or narrow the selection by region or country, offering granular control over the scanning configuration.
     *
     * All documents not specified by this setting are rejected.
     *
     * Refer to the Supported Documents section for the full list of document types and regions.
     *
     * @since 7.0.0
     */
    acceptedDocuments?: Document[];
    /**
     * Documents to reject during ID capture, even if they match types defined in “acceptedDocuments”. This property is useful for enforcing restrictions on documents from certain regions or countries.
     *
     * Refer to the Supported Documents section for the full list of document types and regions.
     *
     * @since 7.0.0
     */
    rejectedDocuments?: Document[];
    /**
     * When enabled, callbacks will be fired for both front and back side captures when scanning double-sided documents. This allows applications to receive partial results even if the back side scan fails. When disabled (default), callbacks are only fired when document recognition is complete. Use {@link CapturedId.isCapturingComplete} to determine if the captured result represents a complete or partial recognition.
     *
     * @since 8.6.1
     */
    notifyOnSideCapture?: boolean;
    /**
     * Defines the scanner configuration for capturing identity documents, including physical documents and mobile documents.
     *
     * For physical document scanning, assign an {@link IdCaptureScanner} wrapping either a {@link FullDocumentScanner} (comprehensive scanning of all zones and both sides of card-format documents) or a {@link SingleSideScanner} (targeted zone scanning). For mobile documents (mDL, mdoc), use a {@link MobileDocumentScanner} instead. There is no default that captures any document — this property must be explicitly set before creating the {@link IdCapture} instance.
     *
     * @since 7.0.0
     */
    scanner?: ScannerType;
    /**
     * The timeout in seconds for document localization without successful capture. When a document is localized but not captured within this duration, the IdCaptureListener.didRejectId() callback is triggered with {@link RejectionReason.Timeout}. Default is 6 seconds. Values less than or equal to 0 reset to the default value.
     *
     * @since 8.7.0
     */
    rejectionTimeoutSeconds?: number;
    captureTrigger?: 'auto' | 'buttonTap';
    anonymizationMap?: unknown;
    /**
     * Controls whether the SDK applies default anonymization rules for specific document types and regions. When enabled, the SDK automatically anonymizes fields that are protected by default for certain document types.
     *
     * When disabled, only fields explicitly added via {@link IdCaptureSettings.addAnonymizedField} will be anonymized.
     *
     * This provides fine-grained control over which data is anonymized, allowing compliance with specific legal requirements. Default is *true*.
     *
     * @since 8.2.0
     */
    anonymizeDefaultFields?: boolean;
}
interface ImageToResultSettings {
    face?: boolean;
    croppedDocument?: boolean;
    frame?: boolean;
}
/**
 * Represents a duration of time in terms of days, months, and years.
 *
 * @since 7.6.0
 */
interface Duration {
    /**
     * The number of days in the duration.
     *
     * @since 7.6.0
     */
    days?: number;
    /**
     * The number of months in the duration.
     *
     * @since 7.6.0
     */
    months?: number;
    /**
     * The number of years in the duration.
     *
     * @since 7.6.0
     */
    years?: number;
}
interface Document {
    documentType?: IdCaptureDocumentType;
    documentSubtype?: string | null;
    region?: string | null;
}
/**
 * Types associated with the document classes below
 *
 * @since 7.0.0
 */
type IdCaptureDocumentType = 'driverLicense' | 'idCard' | 'passport' | 'visaIcao' | 'residencePermit' | 'healthInsuranceCard' | 'regionSpecific' | 'visaLetter';
interface ScannerType {
    physicalDocument?: PhysicalDocumentScanner | null;
    mobileDocument?: MobileDocumentScanner | null;
    allowCloudScanning?: boolean;
}
/**
 * Sealed interface representing scanner configurations for physical identity documents (cards and booklets). Physical documents include ID cards, driver’s licenses, passports, and other government-issued documents.Implementations:{@link SingleSideScanner} - Scans specific zones (barcode, MRZ, VIZ) of a document{@link FullDocumentScanner} - Scans all supported parts of a document, including both sides for card-format documents
 *
 * @since 8.0.0
 */
interface PhysicalDocumentScanner {
    isFull: boolean;
    options: ScannerTypeOptions;
}
interface ScannerTypeOptions {
    barcode: boolean;
    machineReadableZone: boolean;
    visualInspectionZone: boolean;
    freeFormText?: boolean;
    manipulationCheck?: boolean;
}
/**
 * Configures scanning of mobile identity documents, including ISO 18013-5 compliant mobile driver’s licenses (mDL) and OCR-based mobile documents.
 *
 * @since 8.0.0
 */
interface MobileDocumentScanner {
    /**
     * Indicates whether ISO 18013-5 mDL scanning is enabled. When enabled, the scanner can read mobile driver’s licenses that comply with the ISO 18013-5 standard via Bluetooth Low Energy (BLE) communication.
     *
     * @since 8.0.0
     */
    iso180135?: boolean;
    /**
     * Indicates whether OCR is enabled to extract data from mobile documents using a proprietary format. Note that this feature requires the ScanditLabelCaptureText library.
     *
     * @since 8.0.0
     */
    ocr?: boolean;
    /**
     * The set of data elements that the application intends to retain from scanned mobile documents. This information is used to set the IntentToRetain flag in ISO 18013-5 mdoc requests, which is required for legal compliance with data protection standards. An empty set indicates no elements will be retained, and IntentToRetain will be set to false for all fields.
     *
     * @since 8.0.0
     */
    elementsToRetain?: MobileDocumentScannerElementsToRetainItem[];
}
interface MobileDocumentScannerElementsToRetainItem {
    namespace: string;
    field: string;
}
/**
 * Determines what feedback (vibration, sound) should be emitted during the ID Capture process.
 *
 * The feedback is specified for each {@link IdCapture} instance separately and can be changed through the {@link IdCapture.feedback} property by either modifying an existing instance of this class, or by assigning a new one.
 *
 * @since 6.21.0
 */
interface IdCaptureFeedback {
    /**
     * A {@link Feedback} that is emitted when IdCaptureListener.didCaptureId() event is triggered.
     *
     * @since 6.21.0
     */
    idCaptured?: Feedback$1;
    /**
     * A {@link Feedback} that is emitted when IdCaptureListener.didRejectId() event is triggered.
     *
     * @since 6.21.0
     */
    idRejected?: Feedback$1;
}
interface TextCapture {
    type: 'textCapture';
    settings?: TextCaptureSettings;
    feedback?: TextCaptureFeedback;
}
interface TextCaptureSettings {
    duplicateFilter?: number;
    recognitionDirection?: 'none' | 'horizontal' | 'leftToRight' | 'rightToLeft' | 'vertical' | 'topToBottom' | 'bottomToTop';
    locationSelection?: LocationSelection$1 | null;
    licenseKey?: string;
    licensee?: string;
}
interface TextCaptureFeedback {
    success?: Feedback$1;
}
/**
 * Capture mode that implements BarcodeFind.
 *
 * @since 6.22.0
 */
interface BarcodeFind {
    type: 'barcodeFind';
    settings?: BarcodeFindSettings;
    /**
     * Instance of {@link BarcodeFindFeedback} that is used by the barcode scanner to notify users about Found events.
     *
     * The default instance of the Feedback will have both sound and vibration enabled. A default beep sound will be used for the sound.
     *
     * @since 6.22.0
     */
    feedback?: BarcodeFindFeedback;
    enabled?: boolean;
    itemsToFind?: string | null;
    hasBarcodeTransformer?: boolean;
    hasListeners?: boolean;
    barcodeTransformer?: unknown | null;
}
/** @since 6.22.0 */
interface BarcodeFindSettings {
    symbologies?: SymbologySettings;
}
/**
 * Determines what feedback (vibration, sound) should be emitted when barcodes are scanned.
 *
 * The feedback is specified for each BarcodeFind instance separately and can be changed through the feedback property by either modifying an existing instance of this class, or by assigning a new one.
 *
 * As of now, this class allows to configure the feedback that gets emitted when barcodes are found successfully, through the {@link BarcodeFindFeedback.found} property.
 *
 * See documentation on the {@link BarcodeFind.feedback} property for usage samples.
 *
 * @since 6.22.0
 */
interface BarcodeFindFeedback {
    /**
     * A {@link Feedback} for a barcode found event.
     *
     * @since 6.22.0
     */
    found?: Feedback$1;
    /**
     * A {@link Feedback} for the item list updated event.
     *
     * @since 6.24.0
     */
    itemListUpdated?: Feedback$1;
}
/**
 * Capture mode that implements Barcode AR.
 *
 * @since 7.1.0
 */
interface BarcodeAr {
    type: 'barcodeAr';
    settings?: BarcodeArSettings;
    /**
     * Instance of {@link BarcodeArFeedback} that is used by the barcode scanner to notify users about Ar events.
     *
     * The default instance of the Feedback will have both sound and vibration enabled. A default beep sound will be used for the sound.
     *
     * @since 7.1.0
     */
    feedback?: BarcodeArFeedback;
    hasModeListener?: boolean;
    hasBarcodeFilter?: boolean;
}
/** @since 7.1.0 */
interface BarcodeArSettings {
    symbologies?: SymbologySettings;
    expectOnlyUniqueBarcodes?: boolean;
}
/**
 * Determines what feedback (vibration, sound) should be emitted when barcodes are checked.
 *
 * The feedback is specified for each BarcodeAr instance separately and can be changed through the feedback property by either modifying an existing instance of this class, or by assigning a new one.
 *
 * See documentation on the {@link BarcodeAr.feedback} property for usage samples.
 *
 * @since 7.1.0
 */
interface BarcodeArFeedback {
    /**
     * A {@link Feedback} for a barcode scanned event.
     *
     * @since 7.1.0
     */
    scanned?: Feedback$1;
    /**
     * A {@link Feedback} for an element tapped event.
     *
     * @since 7.1.0
     */
    tapped?: Feedback$1;
}
/**
 * Capture mode that implements barcode pick.
 *
 * @since 6.19.0
 */
interface BarcodePick {
    type: 'barcodePick';
    settings?: BarcodePickSettings;
}
/**
 * Contains the scanning options for an {@link BarcodePick} mode.
 *
 * @since 6.19.0
 */
interface BarcodePickSettings {
    symbologies?: SymbologySettings;
    /**
     * Enables or disables the audio feedback. By default *true*.
     *
     * @since 6.19.0
     */
    soundEnabled?: boolean;
    hapticEnabled?: boolean;
    /**
     * Enables or disables the caching of scanned barcodes to a specific product identifier. Once enabled, the request for product identifier won’t be made if scanned barcodes could be found in cache. By default *true*.
     *
     * @since 6.23.0
     */
    cachingEnabled?: boolean;
    /**
     * Sets and access the barcode filter settings.
     *
     * @since 8.2.0
     */
    filterSettings?: BarcodeFilterSettings;
}
/**
 * These settings are used to select barcodes that will be filtered out in the view. Any barcode that matches any of the provided settings will be covered by a colored layer.
 *
 * @since 6.17.0
 */
interface BarcodeFilterSettings {
    /**
     * A set of {@link Symbology} to exclude. If an excluded {@link Symbology} is not part of the set of active symbologies in the mode, this setting will have no effect on that Symbology.
     *
     * @since 6.17.0
     */
    excludedSymbologies?: Symbology[];
    /**
     * A map of excluded symbol counts, indexed by {@link Symbology}. Each {@link Symbology} will have assigned a set of all the character counts for the barcode’s `Data` that will be matched.
     *
     * @since 8.3.0
     */
    excludedSymbolCounts?: unknown;
    /**
     * A regular expression to be matched against `Data`.
     *
     * @since 6.17.0
     */
    excludedCodesRegex?: string;
    /**
     * When set to *true*, EAN 13 barcodes will be excluded.
     *
     * @since 6.17.0
     */
    excludeEan13?: boolean;
    /**
     * When set to *true*, UPC-A barcodes will be excluded.
     *
     * @since 6.17.0
     */
    excludeUpca?: boolean;
}
/**
 * An enumeration of barcode types (symbologies) supported by the Scandit Data Capture SDK.
 *
 * The availability of the symbology depends on the licensed features.
 *
 * @since 6.5.0
 */
type Symbology = 'ean13Upca' | 'ean8' | 'upce' | 'code11' | 'code25' | 'code32' | 'code39' | 'code93' | 'code128' | 'interleavedTwoOfFive' | 'qr' | 'microQr' | 'dataMatrix' | 'pdf417' | 'microPdf417' | 'msiPlessey' | 'databar' | 'databarLimited' | 'databarExpanded' | 'codabar' | 'aztec' | 'dotcode' | 'maxicode' | 'kix' | 'royal-mail-4state' | 'lapa4sc' | 'iata2of5' | 'matrix2of5' | 'uspsIntelligentMail' | 'aruco' | 'upu-4state' | 'australian-post-4state' | 'french-post' | 'hanXin';
/**
 * Barcode Count is a data capture mode that implements MatrixScan Count in use cases that include a counting workflow such as receiving, inventory count, and stock taking. MatrixScan Count is an out-of-the-box scan and count solution that enables faster and more accurate counting of multiple items at once.
 *
 * Learn more on how to use Barcode Count in our [Get Started](https://docs.scandit.com/sdks/react-native/matrixscan-count/get-started) guide.
 *
 * @since 6.17.0
 */
interface BarcodeCount {
    type: 'barcodeCount';
    settings?: BarcodeCountSettings;
    additionalBarcodes?: Barcode[];
    /**
     * Instance of {@link BarcodeCountFeedback} that is used by the barcode scanner to notify users about Success and Failure events.
     *
     * The default instance of the Feedback will have both sound and vibration enabled. A default beep sound will be used for the sound.
     *
     * @since 6.17.0
     */
    feedback?: BarcodeCountFeedback;
    /**
     * Implemented from {@link DataCaptureMode}. See {@link DataCaptureMode.isEnabled}.
     *
     * @since 6.17.0
     */
    isEnabled?: boolean;
    hasListeners?: boolean;
}
/** @since 6.17.0 */
interface BarcodeCountSettings {
    symbologies?: SymbologySettings;
    expectOnlyUniqueBarcodes?: boolean;
    barcodeFilterSettings?: BarcodeFilterSettings;
    /**
     * Declares whether or not the mode will be disabled automatically when the provided capture list has been completed. If no list has been provided, this has no effect.
     *
     * Default value is *false*.
     *
     * @since 8.3.0
     */
    disableModeWhenCaptureListCompleted?: boolean;
    /**
     * Use this property to enable barcode mapping.
     *
     * Default value is *false*.
     *
     * The Barcode Count mapping API is still in beta and may change in future versions of Scandit Data Capture SDK.
     *
     * @since 6.19.0
     */
    mappingEnabled?: boolean;
    tapToUncountEnabled?: boolean;
    shouldShowUnscannedBarcodes?: boolean;
    /**
     * Clustering mode allows smart grouping of neighbouring barcodes. Default to {@link ClusteringMode.Disabled}.
     *
     * @since 8.3.0
     */
    clusteringMode?: 'disabled' | 'manual' | 'auto' | 'autoWithManualCorrection';
    automaticClusteringMethod?: 'vicinity' | 'label' | 'outline' | null;
    expectedBarcodesPerCluster?: number | null;
    groupScanningEnabled?: boolean;
}
/**
 * A recognized barcode.
 *
 * @since 6.5.0
 */
interface Barcode {
    /**
     * The symbology of the barcode.
     *
     * @since 6.5.0
     */
    symbology: Symbology;
    /**
     * The data of this code as a unicode string.
     *
     * For some types of barcodes/2d codes (for example Data Matrix, Aztec, Pdf417), the data may contain non-printable characters, characters that cannot be represented as unicode code points, or nul-bytes in the middle of the string. {@link Barcode.data} may be *null* for such codes. How invalid code points are handled is platform-specific and should not be relied upon. If your applications relies on scanning of such codes, use {@link Barcode.rawData} instead which is capable of representing this data without loss of information.
     *
     * @since 6.5.0
     */
    data: string;
    /**
     * The raw data contained in the barcode.
     *
     * Use this property instead of {@link Barcode.data} if you are relying on binary-encoded data that cannot be represented as unicode strings.
     *
     * Unlike {@link Barcode.data} which returns the data in Unicode representation, the {@link Barcode.rawData} returns the data with the encoding that was used in the barcode. See {@link Barcode.encodingRanges} for more information.
     *
     * The raw data is base64 encoded as a string and might need to be decoded to be used.
     *
     * @since 6.5.0
     */
    rawData: string;
    /**
     * If present, this property returns the add-on code (also known as extension code) associated with this barcode. See [Add-on Codes](https://docs.scandit.com/extension-codes) to understand how add-ons can be enabled.
     *
     * @since 6.5.0
     */
    addOnData?: string | null;
    /** @since 6.6.0 */
    compositeData?: string | null;
    /**
     * The raw data is base64 encoded as a string and might need to be decoded to be used.
     *
     * @since 6.6.0
     */
    compositeRawData?: string;
    /**
     * Array of encoding ranges. Each entry of the returned encoding array points into bytes of {@link Barcode.rawData} and indicates what encoding is used for these bytes. This information can then be used to convert the bytes to unicode, or other representations. For most codes, a single encoding range covers the whole data, but certain 2d symbologies, such as {@link Symbology.QR} allow to switch the encoding in the middle of the code.
     *
     * The returned encoding ranges are sorted from lowest to highest index. Each byte in {@link Barcode.rawData} is contained in exactly one range, e.g. there are no holes or overlapping ranges.
     *
     * @since 6.5.0
     */
    encodingRanges: EncodingRange[];
    /**
     * The location of the code. The coordinates are in image-space, meaning that the coordinates correspond to actual pixels in the image. For display, the coordinates need first to be converted into screen-space using the data capture view. See the Coordinate Conversion Guide for details and examples.
     *
     * The meaning of the values of {@link Quadrilateral.topLeft} etc is such that the top left point corresponds to the top left corner of the barcode, independent of how the code is oriented in the image.
     *
     * If you use {@link BarcodeBatch} you should not use this location at all. Instead use the always up-to-date {@link TrackedBarcode.location}.
     *
     * In case the feature is not licensed, a quadrilateral with all corners set to 0, 0 is returned.
     *
     * @since 6.5.0
     */
    location: Quadrilateral;
    /**
     * Flag to hint whether the barcode is part of a composite code.
     *
     * @since 6.5.0
     */
    compositeFlag: CompositeFlag;
    /**
     * *True* for codes that carry GS1 data.
     *
     * @since 6.5.0
     */
    isGS1DataCarrier: boolean;
    /**
     * Whether the recognized code is color inverted (printed bright on dark background).
     *
     * @since 6.5.0
     */
    isColorInverted: boolean;
    /**
     * The symbol count of this barcode. Use this value to determine the symbol count of a particular barcode, e.g. to configure the active symbol counts.
     *
     * @since 6.5.0
     */
    symbolCount: number;
    frameId: number;
    pixelsPerElement?: number;
    /**
     * If present, this property returns the structured append data associated with this barcode. In structured append mode data is encoded across multiple 1D or 2D barcodes where each barcode contains only one segment of the complete data. Once all segment-containing barcodes are scanned the complete data can be read out.
     *
     * Only a few symbologies (pdf417, microPdf417, QR, DataMatrix, Aztec, DotCode, MaxiCode) can use this mode, and each has a different set of limitations, like included metadata or the maximum number of barcodes that can form a set.
     *
     * @since 6.15.0
     */
    structuredAppendData?: StructuredAppendData | null;
    family?: number;
    /**
     * The number of modules in the X direction (horizontal) of the barcode.
     *
     * @since 8.3.0
     */
    moduleCountX?: number;
    /**
     * The number of modules in the Y direction (vertical) of the barcode.
     *
     * @since 8.3.0
     */
    moduleCountY?: number;
    identifier?: string;
}
/**
 * Defines the encoding of a range of bytes.
 *
 * @since 6.5.0
 */
interface EncodingRange {
    /**
     * Charset encoding name as defined by [IANA](http://www.iana.org/assignments/character-sets/character-sets.xhtml).
     *
     * @since 6.5.0
     */
    ianaName: string;
    /**
     * Start index of this encoding range.
     *
     * @since 6.5.0
     */
    startIndex: number;
    /**
     * End index (first index after the last) of this encoding range.
     *
     * @since 6.5.0
     */
    endIndex: number;
}
/**
 * Polygon represented by 4 corners.
 *
 * @since 6.5.0
 */
interface Quadrilateral {
    /** @since 6.5.0 */
    topLeft: UIPoint;
    /** @since 6.5.0 */
    topRight: UIPoint;
    /** @since 6.5.0 */
    bottomRight: UIPoint;
    /** @since 6.5.0 */
    bottomLeft: UIPoint;
}
/**
 * Structured append data associated with a barcode. returns the structured append data associated with this barcode. In structured append mode data is encoded across multiple 1D or 2D barcodes where each barcode contains only one segment of the complete data. Once all segment-containing barcodes are scanned the complete data can be read out.
 *
 * Only a few symbologies (pdf417, microPdf417, QR, DataMatrix, Aztec, DotCode, MaxiCode) can use this mode, and each has a different set of limitations, like included metadata or the maximum number of barcodes that can form a set.
 *
 * @since 6.15.0
 */
interface StructuredAppendData {
    /**
     * The id of the barcode set.
     *
     * @since 6.15.0
     */
    barcodeSetId: string;
    /**
     * How many barcodes in the set have been scanned.
     *
     * @since 6.15.0
     */
    scannedSegmentCount: number;
    /**
     * How many barcodes belong to the set. Depending on the symbology this might not be available and reported as 0.
     *
     * @since 6.15.0
     */
    totalSegmentCount: number;
    complete: boolean;
    completeDataRaw: string;
    completeDataEncodings: EncodingRange[];
    completeDataUtf8String: string;
}
/**
 * Determines what feedback (vibration, sound) should be emitted when barcodes are scanned.
 *
 * The feedback is specified for each BarcodeCount instance separately and can be changed through the feedback property by either modifying an existing instance of this class, or by assigning a new one.
 *
 * As of now, this class allows to configure the feedback that gets emitted when barcodes are read successfully, through the {@link BarcodeCountFeedback.success} property, and a feedback that gets emitted when barcodes are not read successfully, through the {@link BarcodeCountFeedback.failure} property.
 *
 * See documentation on the {@link BarcodeCount.feedback} property for usage samples.
 *
 * @since 6.17.0
 */
interface BarcodeCountFeedback {
    /**
     * A {@link Feedback} for a success event.
     *
     * @since 6.17.0
     */
    success?: Feedback$1;
    unrecognized?: Feedback$1;
    /**
     * A {@link Feedback} for a failure event.
     *
     * @since 6.17.0
     */
    failure?: Feedback$1;
}
interface BarcodeSequence {
    type: 'barcodeSequence';
    settings?: BarcodeSequenceSettings;
    feedback?: BarcodeSequenceFeedback;
    shelfSequencingValidationPlanogram?: SequencedShelfModule;
}
interface BarcodeSequenceSettings {
    symbologies?: SymbologySettings;
    idleTimeout?: number;
    initialOrderOnShelf?: number;
    initialOrderOnTray?: number;
}
interface BarcodeSequenceFeedback {
    scanned?: Feedback$1;
    tapped?: Feedback$1;
}
interface SequencedShelfModule {
    trays: SequencedTray[];
}
interface SequencedTray {
    orderOnShelf: number;
    barcodes: SequencedBarcode[];
}
interface SequencedBarcode {
    data: string;
    symbology: string;
    orderOnTray: number;
}
interface ContextSettings {
    shouldEnableSubscriptionVerifierV2?: boolean;
}
/**
 * A React Native component that is the main UI view to be used together with the data capture context for applications that wish to display a video preview together with additional augmentations such as barcode locations.
 *
 * This class should generally not be subclassed, instead you can wrap it in another React Native component if necessary.
 *
 * The data capture view itself only displays the preview and shows UI elements to control the camera, such as buttons to switch torch on and off, or a button to switch between front and back facing cameras. Augmentations, such as the locations of identified barcodes are provided by individual overlays. This view will also display errors in case something goes wrong with its context, see the {@link ContextStatus} for a list of possible errors.
 *
 * Unless otherwise specified, methods and properties of this class should only be accessed from the main thread.
 *
 * DataCaptureView class component example:
 *
 * ```jsx
 * class DataCaptureViewComponent extends React.Component {
 *   state = { context: DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --') }
 *
 *   ...
 *
 *   render() {
 *     return (
 *      <DataCaptureView style={{ flex: 1 }} context={this.state.context}/>
 *     );
 *   }
 * }
 * ```
 *
 * **Related topics**: [Get Started](https://docs.scandit.com/sdks/react-native/barcode-capture/get-started), [MatrixScan Get Started](https://docs.scandit.com/sdks/react-native/matrixscan/get-started), Core Concepts <https://docs.scandit.com/core-concepts>.
 *
 * @since 6.5.0
 */
interface DataCaptureView {
    viewId?: number;
    parentId?: number | null;
    /**
     * The point of interest of this data capture view. By default, the point of interest is centered in the data capture view. The point of interest is used to control the *center of attention* for the following subsystems:
     *
     * - Auto focus and exposure metering of the camera.
     * - {@link LocationSelection|Location selections} for capture modes that support them. When no location selection is set, the point of interest defines the location at which the recognition optimizes for reading codes/text/etc.
     * - Rendered {@link Viewfinder|viewfinders}.
     *
     * The point of interest can be overwritten by individual capture modes such as {@link BarcodeCapture}. The overwriting point of interest only affects the center of the location selection and viewfinder of said mode, it does not affect the auto focus or exposure metering of the camera.
     *
     * @since 6.5.0
     */
    pointOfInterest?: UIPoint;
    /**
     * The margins to use for the scan area. The margins are measured from the border of the data capture view and allow to specify a region around the border that is excluded from scanning.
     *
     * By default, the margins are zero and the scanning happens in the visible part of the preview.
     *
     * On iOS, the scan area also excludes the left and right safe area insets of the view: on each side, the larger of the margin and the inset applies. This property keeps returning the margins that were set.
     *
     * @since 6.5.0
     */
    scanAreaMargins?: MarginsWithUnit;
    /**
     * The anchor point to use for positioning the “Scanning By Scandit” logo. By default the logo is placed in the lower-right corner of the scan area ({@link Anchor.BottomRight}).
     *
     * To shift the logo relative to the anchor position, use the {@link DataCaptureView.logoOffset} property.
     *
     * This property has no effect when the logo is drawn by one of the viewfinders.
     *
     * @since 6.5.0
     */
    logoAnchor?: Anchor;
    /**
     * The offset applied to the “Scanning By Scandit” logo relative to the {@link DataCaptureView.logoAnchor|logo anchor}. When specified in pixels ({@link MeasureUnit.Pixel}) or device-independent pixels ({@link MeasureUnit.DIP}), the offset is used as-is. When specified as a fraction ({@link MeasureUnit.Fraction}), the offset is computed relative to the view size minus the scan area margins. For example, a value of 0.1 for the x-coordinate will set the offset to be 10% of the view width minus the left and right margins.
     *
     * This property has no effect when the logo is drawn by one of the viewfinders.
     *
     * @since 6.5.0
     */
    logoOffset?: UIPoint;
    logoHidden?: boolean;
    /**
     * The style of the logo which can be either the default extended “Scanning By Scandit” or a minimal “Scandit”.
     *
     * This property has no effect when the logo is drawn by one of the viewfinders.
     *
     * @since 6.8.0
     */
    logoStyle?: LogoStyle;
    overlays?: Overlay[];
    controls?: Control[];
    /**
     * The gesture used to focus. Defaults to {@link TapToFocus}. Set to *null* if no focus gesture is desired.
     *
     * @since 6.7.0
     */
    focusGesture?: FocusGesture | null;
    /**
     * The gesture used to zoom. Defaults to {@link SwipeToZoom}. Set to *null* if no zoom gesture is desired.
     *
     * @since 6.7.0
     * @deprecated since 8.4
     */
    zoomGesture?: ZoomGesture | null;
    /**
     * The gestures used to zoom. Defaults to [{@link SwipeToZoom}, {@link PinchToZoom}]. Set to empty array if no zoom gesture is desired.
     *
     * @since 8.4.0
     */
    zoomGestures?: ZoomGesture[];
    /**
     * When enabled, the data capture view may display notifications to inform users about update in zoom level. Defaults to *true*.
     *
     * @since 8.3.0
     */
    shouldShowZoomNotification?: boolean;
}
/**
 * Holds margin values (left, top, right, bottom) that can each be expressed with a different measure unit.
 *
 * @since 6.5.0
 */
interface MarginsWithUnit {
    /**
     * Left margin.
     *
     * @since 6.5.0
     */
    left?: UIValue;
    /**
     * Top margin.
     *
     * @since 6.5.0
     */
    top?: UIValue;
    /**
     * Right margin.
     *
     * @since 6.5.0
     */
    right?: UIValue;
    /**
     * Bottom margin.
     *
     * @since 6.5.0
     */
    bottom?: UIValue;
}
/**
 * An enumeration of possible anchoring points in a geometric object such as {@link Quadrilateral|quadrilaterals}. Values of this enumeration are typically used to determine where elements are placed on the screen. For example, it is used to place the logo on screen.
 *
 * @since 6.5.0
 */
type Anchor = 'topLeft' | 'topCenter' | 'topRight' | 'centerLeft' | 'center' | 'centerRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
/**
 * Enumeration of possible logo styles shown by the {@link DataCaptureView|view} if no viewfinder that includes the logo is shown.
 *
 * @since 6.8.0
 */
type LogoStyle = 'minimal' | 'extended';
type Overlay = BarcodeCaptureOverlay | BarcodeTrackingBasicOverlay | BarcodeTrackingAdvancedOverlay | BarcodeSelectionBasicOverlay | LabelCaptureBasicOverlay | LabelCaptureAdvancedOverlay | LabelCaptureValidationFlowOverlay | LabelCaptureAdaptiveRecognitionOverlay | IdCaptureOverlay | TextCaptureOverlay | BarcodeCountOverlay;
/**
 * Overlay for the {@link BarcodeCapture} capture mode that displays recognized barcodes on top of a {@link DataCaptureView|data capture view}.
 *
 * The appearance of the visualized barcodes can be configured or turned off completely through the {@link BarcodeCaptureOverlay.brush} property.
 *
 * @since 6.5.0
 */
interface BarcodeCaptureOverlay {
    type: 'barcodeCapture';
    /**
     * The brush used for visualizing a recognized barcode in the UI. To turn off drawing of locations, set the brush to use both a transparent fill and stroke color. By default, the brush has a transparent fill color, a “Scandit”-blue stroke color, and a stroke width of 1.
     *
     * @since 6.5.0
     */
    brush?: Brush;
    selectionBrush?: Brush;
    /**
     * Sets the viewfinder. By default, the viewfinder is *null*. Set this to an instance of {@link Viewfinder} if you want to draw a viewfinder.
     *
     * @since 6.5.0
     */
    viewfinder?: Viewfinder$1;
    /**
     * Whether to show scan area guides on top of the preview. This property is useful during development to visualize the current scan areas on screen. It is not meant to be used for production. By default this property is *false*.
     *
     * @since 6.5.0
     */
    shouldShowScanAreaGuides?: boolean;
    drawLocalizedOnlyBarcodes?: boolean;
    shouldRemoveLocationsAfterScan?: boolean;
    modeId?: number;
}
/**
 * Brushes define how objects are drawn on screen and allow to change their fill and stroke color as well as the stroke width. They are, for example, used to change the styling of barcode locations, or other objects drawn on top of the video preview. Brushes are immutable. Once created none of the members can be modified.
 *
 * @since 6.5.0
 */
interface Brush {
    fill?: Fill;
    stroke?: Stroke;
}
interface Fill {
    color?: Color;
}
/** @since 6.5.0 */
type Color = string;
interface Stroke {
    color?: Color;
    width?: number;
}
/**
 * Interface for viewfinders. Viewfinders are restricted to the set of viewfinders provided by the Scandit Data Capture SDK, it is not possible for customers to implement this interface and provide custom viewfinder implementations. This interface does not expose any methods or properties, it just serves as a tag for different viewfinder styles.
 *
 * Possible viewfinders are:
 *
 * - {@link AimerViewfinder}
 * - {@link RectangularViewfinder}
 * - {@link LaserlineViewfinder}
 *
 * @since 6.5.0
 */
type Viewfinder$1 = NoneViewfinder | RectangularViewfinder$1 | LaserlineViewfinder$1 | SpotlightViewfinder | AimerViewfinder$1 | TargetAimerViewfinder;
interface NoneViewfinder {
    type: 'none';
    pointOfInterest?: UIPoint | null;
}
/**
 * Rectangular viewfinder with an embedded Scandit logo. The rectangle is always centered on the {@link DataCaptureView.pointOfInterest|point of interest} of the view.
 *
 * The rectangular viewfinder is displayed when the recognition is active and hidden when it is not.
 *
 * To use this viewfinder, create a new instance and assign it to the overlay, e.g. the barcode capture overlay via the {@link BarcodeCaptureOverlay.viewfinder} property.
 *
 * @since 6.5.0
 */
interface RectangularViewfinder$1 {
    type: 'rectangular';
    /**
     * The style of the viewfinder.
     *
     * @since 6.8.0
     */
    style?: 'rounded' | 'square';
    size?: UIAspectSize;
    /**
     * The color used to draw the logo and viewfinder when the mode is enabled. The color is always used at full opacity, changing the alpha value has no effect.
     *
     * @since 6.5.0
     */
    color?: Color;
    /**
     * The color used to draw the logo and viewfinder when the mode is disabled. By default transparent.
     *
     * @since 6.11.0
     */
    disabledColor?: Color;
    /**
     * The style of the viewfinder’s lines.
     *
     * @since 6.8.0
     */
    lineStyle?: 'light' | 'bold';
    /**
     * The amount the area outside the viewfinder’s rectangle is dimmed by. Accepts values between 0 (no dimming) and 1 (fully blacked out).
     *
     * @since 6.8.0
     */
    dimming?: number;
    /**
     * The amount the area outside the viewfinder’s rectangle is dimmed by when the mode is disabled. Accepts values between 0 (no dimming) and 1 (fully blacked out).
     *
     * @since 6.11.0
     */
    disabledDimming?: number;
    /**
     * The animation used for the viewfinder, if any.
     *
     * @since 6.8.0
     */
    animation?: RectangularViewfinderAnimation;
    pointOfInterest?: UIPoint | null;
}
/**
 * Standard rectangular viewfinder animation made up of an appear animation as well as a looping animation following the appearance.
 *
 * @since 6.8.0
 */
interface RectangularViewfinderAnimation {
    looping?: boolean;
}
/**
 * A horizontal laser line with a Scandit logo underneath. Toggles color depending on the {@link DataCaptureMode.isEnabled|capture mode enabled} property. The laserline is centered on the data capture view’s {@link DataCaptureView.pointOfInterest|point of interest}.
 *
 * To use this viewfinder, create a new instance and assign it to the overlay, e.g. the barcode capture overlay via the {@link BarcodeCaptureOverlay.viewfinder} property.
 *
 * @since 7.4.0
 */
interface LaserlineViewfinder$1 {
    type: 'laserline';
    style?: 'legacy' | 'animated';
    /**
     * The width of the laser line. The laser line is centered on the {@link DataCaptureView.pointOfInterest|point of interest} of the view. When specifying the width with relative units, the width is measured relative to the view’s width minus the horizontal scan area margins.
     *
     * @since 7.4.0
     */
    width?: UIValue;
    /**
     * The color to be used when recognition is enabled/active.
     *
     * @since 7.4.0
     */
    enabledColor?: Color;
    /**
     * The color to be used when recognition is disabled/inactive.
     *
     * @since 7.4.0
     */
    disabledColor?: Color;
    pointOfInterest?: UIPoint | null;
}
interface SpotlightViewfinder {
    type: 'spotlight';
    size?: UIAspectSize;
    enabledBorderColor?: Color;
    disabledBorderColor?: Color;
    pointOfInterest?: UIPoint | null;
}
/**
 * To use this viewfinder, create a new instance and assign it to the overlay, e.g. the barcode capture overlay via the {@link BarcodeCaptureOverlay.viewfinder} property.
 *
 * @since 6.7.0
 */
interface AimerViewfinder$1 {
    type: 'aimer';
    /**
     * The color of the outer frame.
     *
     * @since 6.7.0
     */
    frameColor?: Color;
    /**
     * The color of the central dot. The alpha value is ignored and remains at 70%.
     *
     * @since 6.7.0
     */
    dotColor?: Color;
    pointOfInterest?: UIPoint | null;
}
interface TargetAimerViewfinder {
    type: 'targetAimer';
    lineColor?: Color;
    lineStrokeWidth?: number;
    aimerColor?: Color;
    radius?: UIValue;
}
interface BarcodeTrackingBasicOverlay {
    type: 'barcodeTrackingBasic';
    /** @deprecated since 7.0 */
    defaultBrush?: Brush;
    brush?: Brush;
    shouldShowScanAreaGuides?: boolean;
    drawLocalizedOnlyBarcodes?: boolean;
    style?: 'frame' | 'dot';
    dotRadius?: UIValue;
    modeId?: number;
    hasListener?: boolean;
}
interface BarcodeTrackingAdvancedOverlay {
    type: 'barcodeTrackingAdvanced';
    shouldShowScanAreaGuides?: boolean;
    modeId?: number;
    hasListener?: boolean;
}
/**
 * An overlay for {@link DataCaptureView} that shows a simple augmentation over each selected barcode.
 *
 * To display the augmentations, this overlay must be attached to a {@link DataCaptureView}. This can be done by passing this overlay to {@link DataCaptureView.addOverlay}.
 *
 * A user of this class may configure the appearance of the augmentations by configuring the brush properties.
 *
 * @since 6.10.0
 */
interface BarcodeSelectionBasicOverlay {
    type: 'barcodeSelectionBasic';
    /**
     * The brush applied to recognized tracked barcodes. Setting this brush to {@link Brush.transparent} hides all tracked barcodes.
     *
     * @since 6.10.0
     */
    trackedBrush?: Brush;
    /**
     * The brush applied to the barcode that is currently being aimed at.
     *
     * @since 6.10.0
     */
    aimedBrush?: Brush;
    /**
     * The brush applied to the barcodes for the short moment when they are being selected.
     *
     * @since 6.10.0
     */
    selectingBrush?: Brush;
    /**
     * The brush applied to selected barcodes. Setting this brush to {@link Brush.transparent} hides all selected barcodes.
     *
     * @since 6.10.0
     */
    selectedBrush?: Brush;
    /**
     * When set to *true*, this overlay will visualize some hints explaining how to use barcode selection.
     *
     * By default this property is *true*.
     *
     * @since 6.10.0
     */
    shouldShowHints?: boolean;
    /**
     * When set to *true*, this overlay will visualize the active scan area used for BarcodeSelection. This is useful to check {@link DataCaptureView.scanAreaMargins|margins} defined on the {@link DataCaptureView} are set correctly. This property is meant for debugging during development and is not intended for use in production.
     *
     * By default this property is *false*.
     *
     * @since 6.10.0
     */
    shouldShowScanAreaGuides?: boolean;
    /**
     * The viewfinder of the overlay. The viewfinder is only visible when the selection type is {@link BarcodeSelectionAimerSelection}.
     *
     * @since 6.10.0
     */
    viewfinder?: Viewfinder$1;
    /**
     * The overlay style. Defaults to Frame.
     *
     * @since 6.10.0
     */
    style?: 'dot' | 'frame';
    /**
     * The overlay’s background color when in frozen state. This color will be on top of the video preview but below the highlights. Semitransparent black by default.
     *
     * @since 8.7.0
     */
    frozenBackgroundColor?: Color;
    textForSelectOrDoubleTapToFreezeHint?: string;
    textForTapToSelectHint?: string;
    textForDoubleTapToUnfreezeHint?: string;
    textForTapAnywhereToSelectHint?: string;
    textForAimToSelectAutoHint?: string;
    modeId?: number;
    hasAimedBrushProvider?: boolean;
    hasTrackedBrushProvider?: boolean;
}
/**
 * Overlay for label capture that provides visual feedback and customization capabilities for the scanning process. This overlay displays captured labels and their fields on top of the camera preview, offering extensive customization options through listener interfaces.
 *
 * Key visualization features:
 *
 * - **Label highlighting** - Configurable visual feedback for detected labels
 * - **Field state indication** - Different visual styles for predicted vs. captured fields
 * - **Custom brush configuration** - Fully customizable appearance for labels and fields
 * - **Listener-based customization** - Programmatic control over field appearances
 *
 * The overlay distinguishes between different field states:
 *
 * - **Predicted fields** - Fields that have been detected but not yet captured
 * - **Captured fields** - Fields that have been successfully scanned and validated
 *
 * Advanced customization is available through {@link LabelCaptureBasicOverlayListener}, allowing dynamic styling based on field content, validation status, or other contextual information.,
 *
 * Fields are highlighted using a default brush ({@link LabelCaptureBasicOverlay.capturedFieldBrush}, {@link LabelCaptureBasicOverlay.predictedFieldBrush}), a brush set through a user-defined {@link LabelCaptureBasicOverlayListener} or calls to setBrushForFieldOfLabel().
 *
 * @since 6.5.0
 */
interface LabelCaptureBasicOverlay {
    type: 'labelCaptureBasic';
    fieldBrushes?: FieldBrushes;
    /**
     * The brush used for drawing labels if no {@link LabelCaptureBasicOverlay.listener} is set, or the {@link LabelCaptureBasicOverlayListener.brushForLabel} returns a *null* brush.
     *
     * @since 6.5.0
     */
    labelBrush?: Brush;
    /**
     * The viewfinder used to guide users during the scanning process. The viewfinder provides visual cues about the optimal scanning area and helps users position labels correctly.
     *
     * By default, no viewfinder is displayed. Set this to an instance of {@link Viewfinder} (such as {@link RectangularViewfinder}) to provide scanning guidance to users.
     *
     * @since 6.8.0
     */
    viewfinder?: Viewfinder$1;
    /**
     * Controls whether scan area guides are displayed over the camera preview. These guides help visualize the active scanning regions during development and debugging.
     *
     * This feature is intended for development purposes only and should not be enabled in production applications. By default this property is *false*.
     *
     * @since 6.5.0
     */
    shouldShowScanAreaGuides?: boolean;
    modeId?: number;
    hasListener?: boolean;
}
interface FieldBrushes {
    captured?: Brush;
    predicted?: Brush;
}
/**
 * An advanced overlay for {@link DataCaptureView} that enables rich AR-style experiences by allowing custom views to be anchored to captured labels and their individual fields (label location is only supported in some use cases at the moment).This overlay provides sophisticated augmented reality capabilities, allowing you to create dynamic AR elements that react to captured label content. The provided views maintain their relative position to labels and fields as they move in the camera preview, enabling real-time contextual information display.Advanced AR use cases include:**Dynamic warnings** - Display alerts for items near expiration based on captured dates**Contextual information** - Show additional product details or pricing information**Field-specific feedback** - Provide targeted visual feedback for individual label fields**Custom validation indicators** - Create sophisticated validation interfacesThe overlay supports both label-level and field-level view anchoring, providing fine-grained control over AR element positioning and behavior.To display the views, this overlay must be attached to a {@link DataCaptureView}. This can be done by passing this overlay to {@link DataCaptureView.addOverlay}.A user of this class may configure what view is displayed for the given label and the relative position between the two by implementing {@link LabelCaptureAdvancedOverlayListener}.
 *
 * @since 6.17.0
 */
interface LabelCaptureAdvancedOverlay {
    type: 'labelCaptureAdvanced';
    /**
     * Whether to show scan area guides on top of the preview. This property is useful during development to visualize the current scan areas on screen. It is not meant to be used for production. By default this property is *false*.
     *
     * @since 6.17.0
     */
    shouldShowScanAreaGuides?: boolean;
    modeId?: number;
    hasListener?: boolean;
}
/**
 * Specialized overlay that provides a guided scanning experience with validation flow capabilities. This overlay enables multi-step scanning for complete label capture, allowing users to scan label fields progressively across multiple scans and providing a user-friendly data review and correction interface.
 *
 * Key features of the validation flow:
 *
 * - **Multi-step scanning** - Capture several label fields across multiple scans
 * - **Field-by-field validation** - Validate individual fields as they are captured
 * - **User review interface** - Allow users to review and correct captured data
 * - **Configurable hint messages** - Guide users through different scanning stages
 * - **Manual input support** - Enable manual entry for fields that cannot be scanned
 *
 * The validation flow ensures complete and accurate results by aggregating captured fields into a complete label which is reported through the {@link LabelCaptureValidationFlowListener}.
 *
 * This overlay focuses on validation flow and does not provide barcode or field highlighting. For visual feedback during scanning, use {@link LabelCaptureBasicOverlay} alongside this overlay.
 *
 * The validation flow overlay only works with a single label definition. This label definition can contain multiple barcodes, text fields, expiry dates, and other field types.
 *
 * @since 7.5.0
 */
interface LabelCaptureValidationFlowOverlay {
    type: 'validationFlow';
    /**
     * In the past, the window insets for ime were automatically handled by the system, but from android 15 and the edge-to-edge enforcement they need to be handled.
     *
     * Applications should apply insets in a parent of the {@link DataCaptureView} this overlay is attached to, either through android:fitsSystemWindows=”true” in xml, some kind of WindowInsetsListener + padding or a Modifier.imePadding() in compose.
     *
     * The following [guide by the Android team](https://developer.android.com/develop/ui/views/layout/edge-to-edge) explains how to implement edge-to-edge and handle insets in modern android versions.
     *
     * If an application needs to handle insets differently from that and runs into a visual issue where the input fields are behind the keyboard, setting this flag to true will instruct the overlay to manually handle insets internally.
     *
     * Defaults to false on Android. Defaults to true on cross-platform frameworks (React Native, Flutter, Capacitor, Cordova), since their view containers do not handle keyboard insets by default.
     *
     * @since 8.3.0
     */
    shouldHandleKeyboardInsetsInternally?: boolean;
    settings?: LabelCaptureValidationFlowSettings | null;
    modeId?: number;
    hasListener?: boolean;
}
/** @since 7.5.0 */
interface LabelCaptureValidationFlowSettings {
    missingFieldsHint?: string;
    standbyHint?: string;
    validationHint?: string;
    validationError?: string;
    requiredFieldError?: string;
    /**
     * The text shown in the button that allows the user to start the flow by inputting values manually for the label fields.
     *
     * Defaults to “Input Manually”.
     *
     * @since 7.5.0
     */
    manualInputButtonText?: string;
    validationFinishButtonText?: string;
    validationRestartButtonText?: string;
    validationPauseButtonText?: string;
    validationAdaptiveScanningText?: string;
    validationScanningText?: string;
    labelDefinitionsPlaceholders?: unknown;
}
/**
 * Specialized overlay that provides a guided adaptive recognition experience for Label Capture. The overlay coordinates the UI during the adaptive recognition flow and reports results through the {@link LabelCaptureAdaptiveRecognitionListener}.
 *
 * @since 8.2.0
 */
interface LabelCaptureAdaptiveRecognitionOverlay {
    type: 'receiptScanning';
    settings?: LabelCaptureAdaptiveRecognitionSettings | null;
    modeId?: number;
    hasListener?: boolean;
}
/**
 * Settings to customize the adaptive recognition receipt scanning UI. These settings are applied to {@link LabelCaptureAdaptiveRecognitionOverlay} using {@link LabelCaptureAdaptiveRecognitionOverlay.applySettings}.
 *
 * @since 8.2.0
 */
interface LabelCaptureAdaptiveRecognitionSettings {
    processingHint?: string;
    /**
     * Hint text displayed while the overlay is processing captured data.
     *
     * @since 8.2.0
     */
    processingHintText?: string;
    /**
     * Type of the document to search for.
     *
     * @since 8.2.0
     */
    resultType?: 'receipt';
}
/**
 * Overlay that guides the user through the {@link IdCapture} process.
 *
 * In order to display this overlay, add it to {@link DataCaptureView|data capture view}.
 *
 * This overlay shows a viewfinder, automatically selected based on IdCaptureSettings.AcceptedDocuments and IdCaptureSettings.Scanner, along with animations and textual hints, that allow the user to capture smoothly and avoid common pitfalls. It is designed to work out-of-the-box for a wide range of use-cases.
 *
 * You can tweak the look of the viewfinder by setting {@link IdCaptureOverlay.idLayoutStyle} and {@link IdCaptureOverlay.idLayoutLineStyle}. Additionally you can configure the brush used to highlight localized, captured, or rejected documents.
 *
 * You can translate the texts used by the viewfinder into various languages by adding adding string resources with the following ids to your app:
 *
 * | Resource id | Comment |
 * | --- | --- |
 * | scandit_id_capture_camera_too_far | Document cannot be captured, because the camera is too far. |
 * | scandit_id_capture_document_partially_visible | Document cannot be captured, because it’s only partially visible - either covered or not fully fitting the frame of the camera. |
 * | scandit_id_capture_tap_shutter_to_scan | Ask the user to tap the shutter button to let {@link IdCapture} start capturing a document |
 * | scandit_id_capture_looking_for_document | Tell the user that {@link IdCapture} is looking for a document to capture |
 * | scandit_id_capture_hold_still | Ask the user to hold still the device so that the document can be captured |
 * | scandit_id_capture_show_document | Ask the user to show a document, front of card capture scenario or multiple document types selected. |
 * | scandit_id_capture_show_passport | Ask the user to show the passport. |
 * | scandit_id_capture_show_front_of_document | Ask the user to show the front side of a document in the front & back capture scenario. |
 * | scandit_id_capture_show_back_of_document | Ask the user to show the back side of a document in the front & back capture scenario. |
 * | scandit_id_capture_show_barcode_on_document | Ask the user to show the barcode on a document, either when a barcode type is selected or the back side of a document in the front & back capture scenario contains only a barcode. |
 * | scandit_id_capture_show_visa | Ask the user to show the visa. |
 *
 * @since 6.8.0
 */
interface IdCaptureOverlay {
    type: 'idCapture';
    idLayout?: 'td1' | 'td2' | 'td3' | 'mrvA' | 'viz' | 'pdf417' | 'auto' | 'none';
    /**
     * The ID layout style of the overlay. By default this is {@link IdLayoutStyle.Rounded}.
     *
     * @since 6.8.0
     */
    idLayoutStyle?: 'rounded' | 'square';
    /**
     * The ID layout line style. By default this is {@link IdLayoutLineStyle.Light}.
     *
     * @since 6.8.0
     */
    idLayoutLineStyle?: 'light' | 'bold';
    /**
     * The brush used to draw rectangular highlights around captured personal identification documents or their parts such as barcodes or Machine Readable Zones (MRZs). By default it equals DefaultCapturedBrush.
     *
     * To disable highlights use {@link Brush.transparent}.
     *
     * @since 6.10.0
     */
    capturedBrush?: Brush;
    /**
     * The brush used to draw rectangular highlights around localized personal identification documents or their parts such as barcodes or Machine Readable Zones (MRZs). A document or its part is considered localized when it’s detected in a frame, but its data is not yet extracted. By default it equals DefaultLocalizedBrush.
     *
     * To disable highlights use {@link Brush.transparent}.
     *
     * @since 6.10.0
     */
    localizedBrush?: Brush;
    /**
     * The brush used to draw rectangular highlights around personal identification documents or their parts (such as barcodes), which were detected in a frame but rejected. For example, data encoded in a barcode may have an unsupported format. By default it equals DefaultRejectedBrush.
     *
     * To disable highlights use {@link Brush.transparent}.
     *
     * @since 6.10.0
     */
    rejectedBrush?: Brush;
    /**
     * Indicates whether text hints are shown or not. True by default.
     *
     * @since 6.23.0
     */
    showTextHints?: boolean;
    /**
     * The text hint position of the overlay. By default this is {@link TextHintPosition.AboveViewfinder}.
     *
     * @since 6.23.0
     */
    textHintPosition?: 'aboveViewfinder' | 'belowViewfinder';
    frontSideTextHint?: string | null;
    backSideTextHint?: string | null;
    moveCloserTextHint?: string;
    moveFurtherAwayTextHint?: string;
    tapShutterToScanTextHint?: string;
    lookingForDocumentTextHint?: string;
    holdStillTextHint?: string;
    modeId?: number;
}
interface TextCaptureOverlay {
    type: 'textCapture';
    brush?: Brush;
    viewfinder?: Viewfinder$1;
    shouldShowScanAreaGuides?: boolean;
}
interface BarcodeCountOverlay {
    type: 'barcodeCountBasic';
    style?: 'icon' | 'dot';
    notInListBrush?: Brush;
    recognizedBrush?: Brush;
    unrecognizedBrush?: Brush;
    shouldShowScanAreaGuides?: boolean;
    filterOverlaySettings?: FilterOverlaySettings;
    shouldEnableUserGuidance?: boolean;
    shouldShowHints?: boolean;
    colorScheme?: 'default' | 'accessible';
    textForUnscannedBarcodeDetectedHint?: string;
    textForUnrecognizedBarcodesDetectedHint?: string;
    textForWrongBarcodeDetectedHint?: string;
    textForTapShutterToScanHint?: string;
    textForScanningHint?: string;
    textForMoveCloserAndRescanHint?: string;
    textForMoveFurtherAndRescanHint?: string;
    textForTapToUncountHint?: string;
    textForScreenCleanedUpHint?: string;
    textForNewGroupHint?: string;
    textForSwipeToGroupHint?: string;
    textForRescanYellowCodesHint?: string;
}
interface FilterOverlaySettings {
    brush?: Brush;
    highlightType?: 'blurred' | 'brush';
}
/**
 * Interface for custom controls on top of the data capture view. Controls are restricted to the set of controls provided by the Scandit Data Capture SDK, it is not possible for customers to implement this interface and provide custom control implementations. This interface does not expose any methods or properties, it just serves as a tag for different controls.
 *
 * @since 6.8.0
 */
type Control = TorchSwitchControl$1 | CameraSwitchControl$1 | ZoomSwitchControl$1 | MacroModeControl | LinearControlGroup;
/**
 * Control that allows to toggle the torch on and off. The torch switch control hides itself automatically in case the active frame source doesn’t have a torch.
 *
 * You can add this control to a view by calling {@link DataCaptureView.addControl}.
 *
 * @since 6.8.0
 */
interface TorchSwitchControl$1 {
    type: 'torch';
    anchor?: Anchor;
    offset?: UIPoint;
    contentDescriptionWhenOff?: string;
    contentDescriptionWhenOn?: string;
    /**
     * Accessibility label text used for the control button when the torch is off.
     *
     * @since 8.3.0
     */
    accessibilityLabelWhenOff?: string;
    /**
     * Accessibility label text used for the control button when the torch is on.
     *
     * @since 8.3.0
     */
    accessibilityLabelWhenOn?: string;
    /**
     * Accessibility hint text used for the control button when the torch is off.
     *
     * This property will have no effect when running on Android.
     *
     * @since 8.3.0
     */
    accessibilityHintWhenOff?: string;
    /**
     * Accessibility hint text used for the control button when the torch is on.
     *
     * This property will have no effect when running on Android.
     *
     * @since 8.3.0
     */
    accessibilityHintWhenOn?: string;
    icon?: TorchIcon;
}
interface TorchIcon {
    on?: IconState;
    off?: IconState;
}
interface IconState {
    default?: unknown;
    pressed?: unknown;
}
/**
 * Control that allows to switch between a primary and a secondary camera.
 *
 * You can add this control to a view by calling {@link DataCaptureView.addControl}.
 *
 * Adding a camera switch control to a view sets the primary camera as the view’s context frame source.
 *
 * @since 8.6.0
 */
interface CameraSwitchControl$1 {
    type: 'camera';
    anchor?: Anchor;
    offset?: UIPoint;
    contentDescriptionWhenUserFacing?: string;
    contentDescriptionWhenWorldFacing?: string;
    /**
     * Accessibility label text used for the button when the world facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityLabelWhenWorldFacing?: string;
    /**
     * Accessibility label text used for the button when the user facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityLabelWhenUserFacing?: string;
    /**
     * Accessibility hint text used for the button when the world facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityHintWhenWorldFacing?: string;
    /**
     * Accessibility hint text used for the button when the user facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityHintWhenUserFacing?: string;
    /**
     * The primary camera. Calling {@link DataCaptureView.addControl} sets this camera as the view’s context frame source.
     *
     * @since 8.6.0
     */
    primaryCamera: Camera$1;
    /**
     * The secondary camera.
     *
     * @since 8.6.0
     */
    secondaryCamera: Camera$1;
    icon?: CameraIcon;
}
interface CameraIcon {
    primaryCamera?: CameraSwitchControlIconState;
    secondaryCamera?: CameraSwitchControlIconState;
}
interface CameraSwitchControlIconState {
    default?: unknown;
    pressed?: unknown;
}
/**
 * Control that allows switching between configurable camera zoom levels. The available zoom levels are filtered based on the camera hardware capabilities.
 *
 * You can add this control to a view by calling {@link DataCaptureView.addControl}.
 *
 * @since 6.10.0
 */
interface ZoomSwitchControl$1 {
    type: 'zoom';
    anchor?: Anchor;
    offset?: UIPoint;
    /**
     * The orientation of the zoom switch control. Defaults to {@link ZoomSwitchOrientation.Default}.
     *
     * @since 8.4.0
     */
    orientation?: 'default' | 'horizontal' | 'vertical';
    /**
     * When *true*, the control is always shown in its expanded state, displaying all zoom levels regardless of user interaction, and {@link ZoomSwitchControl.isExpanded} is always *true*. When *false*, the control can be collapsed. Defaults to *false*.
     *
     * @since 8.4.0
     */
    isAlwaysExpanded?: boolean;
    /**
     * Whether the control is currently expanded, showing all zoom levels. Can be set programmatically to expand or collapse the control. When {@link ZoomSwitchControl.isAlwaysExpanded} is *true*, this property always returns *true* and setting it has no effect.
     *
     * @since 8.4.0
     */
    isExpanded?: boolean;
    /**
     * The accessibility label. The placeholder `<level>` is replaced with the zoom factor of each button. Defaults to `"Zoom <level>"`.
     *
     * @since 8.4.0
     */
    accessibilityLabel?: string;
    /**
     * The accessibility hint. Defaults to `"Adjusts the camera zoom level"`.
     *
     * This property will have no effect when running on Android.
     *
     * @since 8.4.0
     */
    accessibilityHint?: string;
    /** @deprecated since 8.4 */
    contentDescriptionWhenZoomOff?: string;
    /** @deprecated since 8.4 */
    contentDescriptionWhenZoomOn?: string;
    /** @deprecated since 8.4 */
    icon?: ZoomIcon;
}
interface ZoomIcon {
    zoomedOut?: ZoomSwitchControlIconState;
    zoomedIn?: ZoomSwitchControlIconState;
}
interface ZoomSwitchControlIconState {
    default?: unknown;
    pressed?: unknown;
}
interface MacroModeControl {
    type: 'macro';
    anchor?: Anchor;
    offset?: UIPoint;
    icon?: MacroIcon;
}
interface MacroIcon {
    auto?: MacroModeControlIconState;
    on?: MacroModeControlIconState;
    off?: MacroModeControlIconState;
}
type MacroModeControlIconState = unknown;
interface LinearControlGroup {
    type: 'linearGroup';
    anchor?: Anchor;
    offset?: UIPoint;
    orientation?: 'vertical' | 'horizontal';
    spacing?: UIValue;
    childControls?: unknown[];
}
/**
 * Common interface for all the focus gestures.
 *
 * @since 6.7.0
 */
interface FocusGesture {
    type: 'tapToFocus';
    /**
     * If enabled triggering the focus gesture will also show a visual indicator. Defaults to *true*.
     *
     * @since 8.3.0
     */
    showUIIndicator?: boolean;
}
/**
 * Common interface for all the zoom gestures.
 *
 * @since 6.7.0
 */
interface ZoomGesture {
    type: 'swipeToZoom' | 'pinchToZoom';
}

interface DataCaptureContextProxy extends CoreProxy {
    get framework(): string;
    get frameworkVersion(): string;
}
declare enum DataCaptureContextEvents {
    didChangeStatus = "DataCaptureContextListener.onStatusChanged",
    didStartObservingContext = "DataCaptureContextListener.onObservationStarted",
    didChangeFrameSource = "DataCaptureContextListener.onFrameSourceChanged"
}
/** Native context events, reported by {@link DataCaptureContextController}. */
interface DataCaptureContextControllerListener {
    didChangeStatus(contextStatus: ContextStatus): void;
    didStartObservingContext(): void;
}
declare class DataCaptureContextController extends BaseController<DataCaptureContextProxy> {
    private readonly listener;
    private _listenerRegistered;
    private adapter;
    get framework(): string;
    get frameworkVersion(): string;
    static getOpenSourceSoftwareLicenseInfo(): Promise<OpenSourceSoftwareLicenseInfo>;
    constructor(listener: DataCaptureContextControllerListener);
    subscribeListener(): Promise<void>;
    updateContextFromJson(context: Context): Promise<void>;
    addModeToContext(mode: Mode): Promise<void>;
    removeModeFromContext(mode: Mode): Promise<void>;
    removeAllModesFromContext(): Promise<void>;
    dispose(): void;
    unsubscribeListener(): Promise<void>;
    createContextFromJson(context: Context): Promise<void>;
    private handleDidChangeStatusEvent;
    private handleDidChangeFrameSourceEvent;
    private handleDidStartObservingContextEvent;
    private reportStatus;
}

/** @since 6.5.0 */
interface DataCaptureContextCreationOptions {
    /**
     * The device name allows to optionally identify the device with a user-provided name. This name is then associated with unique identifier of the device and displayed in the online dashboard.
     *
     * @since 6.5.0
     */
    deviceName?: string | null;
}




/**
 * Interface for observing/listening to mode and status changes of a data capture context.
 *
 * To observe changes of the data capture context, one or more {@link DataCaptureContextListener} may be added. These listeners provide hooks into different parts of the data capture context.
 *
 * @since 6.5.0
 */
interface DataCaptureContextListener {
    /**
     * Called when a context status changed.
     *
     * @since 6.5.0
     */
    didChangeStatus?(context: DataCaptureContext, contextStatus: ContextStatus): void;
    /**
     * Called when the listener has been added to the data capture context and is from now on receiving events.
     *
     * @since 6.5.0
     */
    didStartObservingContext?(context: DataCaptureContext): void;
}

/**
 * This class can be used to configure frame retrieval through file system caching. Users can enable or disable caching, specify the quality of the image to use when compressing frames into JPEG/PNG format, and configure automatic rotation in case the image isn’t following the rotation of the phone. The defaults are chosen to provide a good balance between performance and quality for most use cases.
 *
 * @since 7.5.0
 */
declare class FrameDataSettings extends DefaultSerializeable {
    private _isFileSystemCacheEnabled;
    private _imageQuality;
    private _isAutoRotateEnabled;
    /**
     * Creates new default frame settings. {@link FrameDataSettings.isFileSystemCacheEnabled} is set to false, {@link FrameDataSettings.imageQuality} is set to 100, and {@link FrameDataSettings.isAutoRotateEnabled} is set to false.
     *
     * @since 7.5.0
     */
    constructor();
    /**
     * Enables or disables the file system cache for frames. When enabled, processed frames are cached to the file system for improved performance.
     *
     * The default value is false.
     *
     * @since 7.5.0
     */
    get isFileSystemCacheEnabled(): boolean;
    set isFileSystemCacheEnabled(enabled: boolean);
    /**
     * Sets the quality of the saved frame images. Higher values produce better quality images but larger file sizes. Valid range is 0-100.
     *
     * - 0: Lowest quality, smallest file size
     * - 100: Highest quality, largest file size
     *
     * The default value is 100. Throws an Error if the value is not between 0 and 100.
     *
     * @since 7.5.0
     */
    get imageQuality(): number;
    set imageQuality(quality: number);
    /**
     * Enables or disables automatic rotation of frames.
     *
     * The default value is false.
     *
     * @since 7.5.0
     */
    get isAutoRotateEnabled(): boolean;
    set isAutoRotateEnabled(enabled: boolean);
}

/**
 * Builder pattern implementation for creating and configuring {@link FrameDataSettings} instances. Provides a fluent interface for setting frame data handling options such as image quality, file system caching, and automatic rotation.
 *
 * @since 7.5.0
 */
declare class FrameDataSettingsBuilder {
    private settings;
    /**
     * Creates a new builder instance with the provided {@link FrameDataSettings} object.
     *
     * @since 7.5.0
     */
    constructor(settings: FrameDataSettings);
    /**
     * Enables or disables the file system cache for frames. When enabled, processed frames are cached to the file system for improved performance on subsequent access.
     *
     * @since 7.5.0
     */
    enableFileSystemCache(enabled: boolean): FrameDataSettingsBuilder;
    /**
     * Sets the quality of the saved frame images. Higher values produce better quality images but larger file sizes. Valid range is 0-100.
     *
     * - 0: Lowest quality, smallest file size
     * - 100: Highest quality, largest file size
     *
     * @since 7.5.0
     */
    setImageQuality(quality: number): FrameDataSettingsBuilder;
    /**
     * Enables or disables automatic rotation of frames based on orientation. When enabled, frames are automatically rotated to match the device’s current orientation.
     *
     * @since 7.5.0
     */
    enableAutoRotate(enabled: boolean): FrameDataSettingsBuilder;
}

/**
 * Holds settings related to the data capture context.
 *
 * @since 6.7.0
 */
declare class DataCaptureContextSettings extends DefaultSerializeable {
    private _frameSettings;
    /**
     * Creates a new settings object with the default values.
     *
     * @since 6.7.0
     */
    constructor();
    /**
     * Gets or sets the frame data settings for the data capture context. These settings control how frame data is handled, including image quality, file system caching, and automatic rotation.
     *
     * @since 7.5.0
     */
    get frameDataSettings(): FrameDataSettings;
    set frameDataSettings(settings: FrameDataSettings);
    /**
     * Returns a new {@link FrameDataSettingsBuilder} instance configured with the current frame data settings. This provides a fluent interface for modifying frame data settings using the builder pattern.
     *
     * The following example shows how to configure frame data settings using the builder pattern:
     *
     * ```jsx
     * const dataCaptureContextSettings = new DataCaptureContextSettings();
     * dataCaptureContextSettings.frameDataSettingsBuilder()
     *   .enableAutoRotate(true)
     *   .enableFileSystemCache(true)
     *   .setImageQuality(70);
     * const dataCaptureContext = DataCaptureContext.forLicenseKeyWithSettings(
     *   '-- ENTER YOUR SCANDIT LICENSE KEY HERE --',
     *   dataCaptureContextSettings
     * );
     * ```
     *
     * @since 7.5.0
     */
    frameDataSettingsBuilder(): FrameDataSettingsBuilder;
    /**
     * Sets a property to the provided value. Use this method to set properties that are not yet part of a stable API. Properties set through this method may or may not be used or change in a future release.
     *
     * @since 6.7.0
     */
    setProperty(name: string, value: any): void;
    /**
     * Retrieves the value of a previously set property.
     *
     * @since 6.7.0
     */
    getProperty(name: string): any;
}




/**
 * {@link DataCaptureMode} is the interface implemented by all data capture modes. A data capture mode encapsulates a specific way of capturing data, such as {@link BarcodeCapture|barcode capture} or {@link BarcodeBatch|Barcode Batch}. Each capture mode can be individually enabled and disabled to switch between different ways of capturing data.
 *
 * Capture modes are restricted to the set of data captures modes provided by the Scandit Data Capture SDK. It is not available for implementing custom data capture modes.
 *
 * Capture modes need to be associated with a {@link DataCaptureContext|data capture context} after they have been created using {@link DataCaptureContext.addMode}. Modes can be removed again using {@link DataCaptureContext.removeMode}.
 *
 * A data capture context can only be associated with one mode at a time. If multiple modes are associated with the same context, the context will not process any frames and report an error.
 *
 * **Usage Sample**
 *
 * Because the {@link DataCaptureMode} cannot be instantiated directly, the example below uses the {@link BarcodeCapture} to illustrate a typical usage of capture modes. Other capture modes will work very similarly. The typical steps are:
 *
 * 1. Configure the capture mode by first creating settings.
 * 2. Instantiate the capture mode and associate with the context and the settings.
 * 3. Registering a mode-specific listener (not shown).
 *
 * Todoadd this to the sample
 *
 * 1. Enabling recognition by setting the {@link DataCaptureMode.isEnabled} property to *true*.
 *
 * ```jsx
 * const settings = new BarcodeCaptureSettings();
 * settings.setSymbologyEnabled(Symbology.QR, true);
 * const barcodeCapture = BarcodeCapture.forContext(
 *   window.captureContext,
 *   settings,
 * );
 * // Capture modes are enabled by default. The next line is not strictly necessary and
 * // is only listed to make you aware of the possibility to enable/disable modes.
 * barcodeCapture.isEnabled = true;
 * ```
 *
 * @since 6.5.0
 */
interface DataCaptureMode extends Serializeable {
    /**
     * *True* if this data capture mode is enabled, *false* if not. Only enabled capture modes are processing frames.
     *
     * Changing this property from *false* to *true* causes this data capture mode to start processing frames.
     *
     * Changing this property from *true* to *false* causes this data capture mode to stop processing frames. The effect is immediate: no more frames will be processed *after* the change. However, if a frame is currently being processed, this frame will be completely processed and deliver any results/callbacks to the registered listeners. When changing this property from one of the listener callbacks that is called as a result of processing the frame, no more frames will be processed after that.
     *
     * Note that this property only affects the data capture and does not affect the {@link FrameSource}’s state.
     *
     * By default, this property is *true*.
     *
     * @since 6.5.0
     */
    isEnabled: boolean;
    /**
     * The context this data capture mode is attached to. When the data capture mode is currently not attached to a context, *null* is returned.
     *
     * @since 6.5.0
     */
    readonly context: DataCaptureContext | null;
}
interface PrivateDataCaptureMode {
    _context: DataCaptureContext | null;
    modeId: number;
}









/**
 * Data capture context is the main class for running data capture related tasks. The context manages one or more {@link DataCaptureMode|capture modes}, such as {@link BarcodeCapture} that perform the recognition. The context itself acts as a scheduler, but does not provide any interfaces for configuring data capture capabilities. Configuration and result handling is handled by the data capture modes directly.
 *
 * A data capture context has exactly one frame source (typically a {@link Camera|built-in camera}). The frame source delivers the frames on which the capture modes should perform recognition on. When a new capture context is created, it’s frame source is *null* and must be initialized for recognition to work.
 *
 * Typically a {@link DataCaptureView} is used to visualize the ongoing data capture process on screen together with one or more {@link DataCaptureOverlay|overlays}. However it’s also possible to use the data capture context without a view to perform off-screen processing.
 *
 * **Related topics**: [Get Started](https://docs.scandit.com/sdks/react-native/barcode-capture/get-started), [MatrixScan Get Started](https://docs.scandit.com/sdks/react-native/matrixscan/get-started), Core Concepts <https://docs.scandit.com/core-concepts>.
 *
 * @since 6.5.0
 */
declare class DataCaptureContext extends DefaultSerializeable {
    private licenseKey;
    private deviceName;
    private static _instance;
    /**
     * Holds the singleton instance of DataCaptureContext, which is managed by Scandit Data Capture SDK. This instance is unusable until properly configured.
     *
     * To configure the instance, call {@link DataCaptureContext.initialize}.
     *
     * @since 7.2.0
     */
    static get sharedInstance(): DataCaptureContext;
    private controller;
    private _framework;
    private _frameworkVersion;
    private settings;
    private _frameSource;
    private view;
    private modes;
    private listeners;
    /**
     * The license text and attributions for all third party software used by the Scandit SDK.
     *
     * @since 7.0.0
     */
    static getOpenSourceSoftwareLicenseInfo(): Promise<OpenSourceSoftwareLicenseInfo>;
    private static get coreDefaults();
    /**
     * Readonly attribute to get the current frame source. To change the frame source use setFrameSource().
     *
     * @since 6.5.0
     */
    get frameSource(): FrameSource$1 | null;
    /**
     * The unique identifier of the device as used by the Scandit Data Capture SDK. This identifier does not contain any device identifying information that would be usable outside of the context of the Scandit Data Capture SDK itself.
     *
     * @since 6.5.0
     */
    static get deviceID(): string | null;
    /**
     * Constructs a data capture context with the provided license key.
     *
     * @since 6.5.0
     */
    static forLicenseKey(licenseKey: string): DataCaptureContext;
    /**
     * Constructs a data capture context with the provided license key and optional settings.
     *
     * @since 6.7.0
     */
    static forLicenseKeyWithSettings(licenseKey: string, settings: DataCaptureContextSettings | null): DataCaptureContext;
    /**
     * Constructs a data capture context with the provided license key and additional options.
     *
     * @since 6.5.0
     */
    static forLicenseKeyWithOptions(licenseKey: string, options: DataCaptureContextCreationOptions | null): DataCaptureContext;
    /**
     * Initializes the singleton context instance with the provided license key, and returns the same instance.
     *
     * @since 7.2.0
     */
    static initialize(licenseKey: string, options?: DataCaptureContextCreationOptions | null, settings?: DataCaptureContextSettings | null): DataCaptureContext;
    private static create;
    private constructor();
    /**
     * Sets the frame source of this data capture context.
     *
     * Frame sources produce frames to be processed by the data capture context. The user typically doesn’t create their own frame sources, but use one of the frame sources provided by the Scandit Data Capture SDK. Typical frame sources are web cams, or built-in cameras of a mobile device.
     *
     * Setting the frame source to *null* will effectively stop recognition of this capture context.
     *
     * @since 6.5.0
     */
    setFrameSource(frameSource: FrameSource$1 | null): Promise<void>;
    /**
     * Mirror a frame-source change that already occurred on the native side (e.g. a
     * CameraSwitchControl tap handled by the native camera switcher, which swaps the context's
     * active camera on its own). Repoints the TS-side frame source and active-context pointers
     * WITHOUT re-serializing to native — native is already in this state, so calling
     * setFrameSource() would trigger a redundant, and failing, swap.
     *
     * Private on purpose: framework-internal callers (CameraSwitchControl) reach it
     * through the PrivateDataCaptureContext cast, keeping it off the public SDK surface.
     */
    private adoptActiveFrameSource;
    private attachView;
    /**
     * Adds the listener to this data capture context. Context listeners receive events when new data capture modes are added, or the frame source changes.
     *
     * In case the same listener is already observing this instance, calling this method will not add the listener again.
     *
     * @since 6.5.0
     */
    addListener(listener: DataCaptureContextListener): Promise<void>;
    /**
     * Removes a previously added listener from this data capture context.
     *
     * In case the listener is not currently observing this instance, calling this method has no effect.
     *
     * @since 6.5.0
     */
    removeListener(listener: DataCaptureContextListener): Promise<void>;
    /**
     * Adds the specified data capture mode to this capture context. Please note that it is not possible to add a mode associated with a context to a different context. If the mode is already associated with this context, this call has no effect.
     *
     * A data capture context can only be associated with one mode at a time. If multiple modes are associated with the same context, the context will not process any frames and report an error.
     *
     * @since 6.5.0
     */
    addMode(mode: DataCaptureMode): Promise<void>;
    /**
     * Sets the specified data capture mode as the active mode of this capture context. Please note that it is not possible to add a mode associated with a context to a different context. If the mode is already associated with this context, this call has no effect.
     *
     * A data capture context can only be associated with one mode at a time. If a new mode is associated with the context, the previous mode will be replaced by the new one.
     *
     * @since 7.2.0
     */
    setMode(mode: DataCaptureMode): Promise<void>;
    /**
     * Removes the currently active mode from this capture context. If the context has no capture mode associated to it, this call has no effect.
     *
     * @since 7.2.0
     */
    removeCurrentMode(): Promise<void>;
    /**
     * Removes the mode from this capture context. If the capture mode is currently not associated to the context, this call has no effect.
     *
     * @since 6.5.0
     */
    removeMode(mode: DataCaptureMode): Promise<void>;
    /**
     * Removes all modes from this capture context. If there currently are no captures modes associated to the context, this call has no effect.
     *
     * @since 6.5.0
     */
    removeAllModes(): Promise<void>;
    /**
     * Disposes/releases this data capture context. This frees most associated resources and can be used to save some memory. Disposed/released contexts cannot be used for recognition anymore, trying will result in a {@link ContextStatus|ContextStatus with error code 1025}. Data capture modes and listeners remain untouched.
     *
     * This method may be called multiple times on the same context. Further calls have no effect.
     *
     * @since 6.5.0
     */
    dispose(): Promise<void>;
    /**
     * Applies the given settings to the data capture context.
     *
     * @since 6.7.0
     */
    applySettings(settings: DataCaptureContextSettings): Promise<void>;
    private notifyListenersOfDidChangeStatus;
    private notifyListenersOfDidStartObservingContext;
    private createNativeContext;
    private update;
    private notifyListenersOfNativeContextError;
    private addModeInternal;
    private removeModeInternal;
    private detachMode;
}
interface PrivateDataCaptureContext {
    controller: DataCaptureContextController;
    modes: [DataCaptureMode];
    components: [DataCaptureComponent];
    listeners: DataCaptureContextListener[];
    view: BaseDataCaptureView | null;
    update: () => Promise<void>;
    initialize(): void;
    adoptActiveFrameSource(frameSource: FrameSource$1): void;
    attachView(view: BaseDataCaptureView): void;
}



/**
 * {@link DataCaptureComponent} is the interface implemented by all data capture components such as the {@link Parser}.
 *
 * @since 6.5.0
 */
interface DataCaptureComponent {
    /**
     * An ID for the component, currently only assignable during deserialization.
     *
     * @since 6.5.0
     */
    readonly id: string;
}
interface PrivateDataCaptureComponent {
    _context: DataCaptureContext;
}

declare const modeBaseBrand: unique symbol;



declare abstract class ModeBase<C extends BaseController<unknown>, L extends BaseController<unknown> = never> extends DefaultSerializeable {
    private state;
    private created;
    private resolveCreated;
    protected modeId: number;
    private controller;
    private listenerController;
    private _context;
    private readonly [modeBaseBrand];
    protected abstract type: string;
    private onStartAddingToContext;
    private onAddedToContext;
    private onFailedAddingToContext;
    private onRemovedFromContext;
    private awaitCreation;
    protected withController(action: (controller: C) => Promise<void>): Promise<void>;
    protected withController<T>(action: (controller: C) => Promise<T>, fallback: T): Promise<T>;
    protected withListenerController(action: (controller: L) => Promise<void>): Promise<void>;
    protected withListenerController<T>(action: (controller: L) => Promise<T>, fallback: T): Promise<T>;
    private logHeld;
    private logModeError;
    get context(): DataCaptureContext | null;
    constructor();
    protected abstract createController(): C;
    protected createListenerController?(): L;
    protected onCreated?(): void;
}
type WithControllerDispatch = (typeof ModeBase.prototype)['withController'];

declare enum VibrationType {
    default = "default",
    selectionHaptic = "selectionHaptic",
    successHaptic = "successHaptic",
    failureHaptic = "failureHaptic",
    waveForm = "waveForm",
    impactHaptic = "impactHaptic"
}

interface VibrationJSON {
    type: string;
    timings: number[] | null;
    amplitudes: number[] | null;
}
interface PrivateVibration {
    fromJSON(json: VibrationJSON): Vibration;
}
/**
 * A vibration, to be emitted for example when a code has been successfully scanned.
 *
 * @since 6.5.0
 */
declare class Vibration extends DefaultSerializeable {
    private type;
    /**
     * The default vibration for a successful scan.
     *
     * @since 6.5.0
     */
    static get defaultVibration(): Vibration;
    /**
     * It creates haptics to indicate a change in selection. In particular it uses UISelectionFeedbackGenerator. Please note that if the device does not have the Taptic Engine, no vibration will be emitted.
     *
     * Only available on iOS.
     *
     * @since 6.7.0
     */
    static get selectionHapticFeedback(): Vibration;
    /**
     * It creates haptics to communicate successes. This is a notification feedback type, indicating that a task has completed successfully. In particular it uses UINotificationFeedbackGenerator with type UINotificationFeedbackTypeSuccess. Please note that if the device does not have the Taptic Engine, no vibration will be emitted.
     *
     * Only available on iOS.
     *
     * @since 6.7.0
     */
    static get successHapticFeedback(): Vibration;
    /**
     * It creates haptics to communicate failures. This is a notification feedback type, indicating that a task has failed. In particular it uses UINotificationFeedbackGenerator with type UINotificationFeedbackTypeError. Please note that if the device does not have the Taptic Engine, no vibration will be emitted.
     *
     * Only available on iOS.
     *
     * @since 8.5.0
     */
    static get failureHapticFeedback(): Vibration;
    /**
     * It creates haptics to communicate impact. In particular it uses UIImpactFeedbackGenerator. Please note that if the device does not have the Taptic Engine, no vibration will be emitted.
     *
     * Only available on iOS.
     *
     * @since 6.21.0
     */
    static get impactHapticFeedback(): Vibration;
    private static fromJSON;
    protected constructor(type: VibrationType);
}
/**
 * A wave form vibration, to be emitted for example when a code has been successfully scanned.
 *
 * The `timings` array must be non-empty. If `amplitudes` is provided, it must contain the same number of elements as `timings`.
 *
 * @since 6.16.0
 */
declare class WaveFormVibration extends Vibration {
    private _timings;
    /**
     * Returns the timings of the WaveFormVibration.
     *
     * @since 6.16.0
     */
    get timings(): number[];
    private _amplitudes;
    /**
     * Returns the amplitudes of the WaveFormVibration.
     *
     * @since 6.16.0
     */
    get amplitudes(): number[] | null;
    /**
     * Creates a new WaveFormVibration object with timings and amplitudes.
     *
     * @since 6.16.0
     */
    constructor(timings: number[], amplitudes?: number[] | null);
}

interface SoundJSON {
    resource: string | null;
}
interface PrivateSound {
    fromJSON(json: SoundJSON): Sound;
}
/**
 * A sound, to be played for example when a code has been successfully scanned.
 *
 * @since 6.5.0
 */
declare class Sound extends DefaultSerializeable {
    /**
     * The name of the resource file, including the extension.
     *
     * On iOS, the file must be added as a resource file, on Android it must be added specifically under app/src/main/assets.
     *
     * @since 6.5.0
     */
    resource: string | null;
    /**
     * The default beep sound for a successful scan.
     *
     * @since 6.5.0
     */
    static get defaultSound(): Sound;
    private static fromJSON;
    constructor(resource: string | null);
}

interface FeedbackJSON {
    vibration: VibrationJSON | null;
    sound: SoundJSON | null;
}
interface PrivateFeedback {
    fromJSON(json: FeedbackJSON): Feedback;
}
/**
 * A feedback consisting of a sound and vibration, for example to be provided by a device when a code has been successfully scanned.
 *
 * @since 6.5.0
 */
declare class Feedback extends DefaultSerializeable {
    /**
     * The default feedback consisting of a default sound and a default vibration.
     *
     * @since 6.5.0
     */
    static get defaultFeedback(): Feedback;
    private _vibration;
    private _sound;
    private controller;
    /**
     * The vibration to be emitted when a feedback is required. If *null*, no vibration is emitted. This property is further influenced by the device’s ring mode: the device may not vibrate even if this property is properly set to a non-*null* instance.
     *
     * @since 6.5.0
     */
    get vibration(): Vibration | null;
    /**
     * The sound to be played when a feedback is required. If *null*, no sound is played. Depending on the device’s ring mode and/or volume settings, no sound may be played even if this property is properly set to a non-*null* instance.
     *
     * @since 6.5.0
     */
    get sound(): Sound | null;
    private static fromJSON;
    /**
     * Creates a Feedback that emits the given vibration and plays the given sound.
     *
     * @since 6.5.0
     */
    constructor(vibration: Vibration | null, sound: Sound | null);
    /**
     * Emits the feedback defined by this object. This method is further influenced by the device’s ring mode and/or volume settings - check {@link Feedback.sound} and {@link Feedback.vibration} for more details.
     *
     * @since 6.5.0
     */
    emit(): void;
    toJSON(): object;
}

declare enum FocusGestureListenerEvents {
    onFocusGesture = "FocusGestureListener.onFocusGesture"
}




interface DataCaptureViewProxy extends CoreProxy {
    $showDataCaptureView({ viewId }: {
        viewId: number;
    }): Promise<void>;
    $hideDataCaptureView({ viewId }: {
        viewId: number;
    }): Promise<void>;
    $createDataCaptureView({ viewJson }: {
        viewJson: string;
    }): Promise<void>;
    $removeDataCaptureView({ viewId }: {
        viewId: number;
    }): Promise<void>;
    $setDataCaptureViewPositionAndSize({ top, left, width, height, shouldBeUnderWebView, }: {
        top: number;
        left: number;
        width: number;
        height: number;
        shouldBeUnderWebView: boolean;
    }): Promise<void>;
}
declare enum DataCaptureViewEvents {
    didChangeSize = "DataCaptureViewListener.onSizeChanged",
    onFocusGesture = "FocusGestureListener.onFocusGesture"
}
/** Native view events, reported by {@link DataCaptureViewController}. */
interface DataCaptureViewControllerListener {
    didChangeSize(size: Size, orientation: Orientation): void;
    /** `pointJson` is the focus point as native encodes it: a JSON-encoded `PointWithUnit`. */
    didFocusGesture(pointJson: string): void;
    didZoomInGesture(): void;
    didZoomOutGesture(): void;
}
/**
 * Clears warn-once bookkeeping between test cases.
 * @internal Test-only; not part of this package's consumable surface.
 */
declare function resetDataCaptureViewPayloadParserWarnings(): void;
declare class DataCaptureViewController extends BaseController<DataCaptureViewProxy> {
    private readonly nativeViewId;
    private readonly listener;
    private _listenerRegistered;
    private _focusGestureListenerRegistered;
    private _zoomGestureListenerRegistered;
    private adapter;
    /** `nativeViewId` reads the id of the native view this controller drives; it changes as the view is (re)created. */
    constructor(nativeViewId: () => number, listener: DataCaptureViewControllerListener);
    viewPointForFramePoint(point: Point): Promise<Point>;
    viewQuadrilateralForFrameQuadrilateral(quadrilateral: Quadrilateral$1): Promise<Quadrilateral$1>;
    triggerFocus(point: PointWithUnit): Promise<void>;
    triggerZoomIn(): Promise<void>;
    triggerZoomOut(): Promise<void>;
    setPositionAndSize(top: number, left: number, width: number, height: number, shouldBeUnderWebView: boolean): Promise<void>;
    show(): Promise<void>;
    hide(): Promise<void>;
    createNativeView(view: DataCaptureView): Promise<void>;
    removeNativeView(viewId?: number): Promise<void>;
    updateView(view: DataCaptureView): Promise<void>;
    dispose(): void;
    subscribeListener(): Promise<void>;
    unsubscribeListener(): Promise<void>;
    updateFocusGestureListenerSubscription(focusGesture: FocusGesture$1 | null, shouldSubscribe: boolean): Promise<void>;
    private subscribeFocusGestureListener;
    private unsubscribeFocusGestureListener;
    private handleOnFocusGestureEvent;
    private handleOnFocusGestureEventWrapper;
    updateZoomGestureListenerSubscription(zoomGestures: ZoomGesture$1[], shouldSubscribe: boolean): Promise<void>;
    selectZoomLevel(zoomLevel: number): Promise<number>;
    private subscribeZoomGestureListener;
    private unsubscribeZoomGestureListener;
    private handleOnZoomInGestureEvent;
    private handleOnZoomInGestureEventWrapper;
    private handleOnZoomOutGestureEvent;
    private handleOnZoomOutGestureEventWrapper;
    private handleDidChangeSizeEvent;
    private handleDidChangeSizeEventWrapper;
    get hasNativeView(): boolean;
}






interface PrivateTapToFocus {
    listeners: FocusGestureListener[];
    onListenersChanged?(): void;
    _controller?: DataCaptureViewController | null;
}
/**
 * Tap to focus gesture.
 *
 * @since 6.7.0
 */
declare class TapToFocus extends DefaultSerializeable implements FocusGesture$1 {
    private type;
    /**
     * If enabled triggering the focus gesture will also show a visual indicator. Defaults to *true*.
     *
     * @since 8.3.0
     */
    showUIIndicator: boolean;
    private listeners;
    private onListenersChanged?;
    private _controller?;
    /**
     * Constructs a new TapToFocus instance. The focus strategy can be changed in the {@link CameraSettings} through {@link CameraSettings.focusGestureStrategy}.
     *
     * @since 6.7.0
     */
    constructor();
    /**
     * Implemented from {@link FocusGesture}. See {@link FocusGesture.addListener}.
     *
     * @since 8.3.0
     */
    addListener(listener: FocusGestureListener): void;
    /**
     * Implemented from {@link FocusGesture}. See {@link FocusGesture.removeListener}.
     *
     * @since 8.3.0
     */
    removeListener(listener: FocusGestureListener): void;
    /**
     * Implemented from {@link FocusGesture}. See {@link FocusGesture.triggerFocus}.
     *
     * @since 8.3.0
     */
    triggerFocus(point: PointWithUnit): Promise<void>;
}

interface FocusGestureJSON {
    type: string;
}
declare class PrivateFocusGestureDeserializer {
    static fromJSON(json: FocusGestureJSON | null): FocusGesture$1 | null;
}

declare class PrivateZoomGestureDeserializer {
    static fromJSON(json: ZoomGestureJSON | null): ZoomGesture$1 | null;
    static fromJSONArray(jsonArray: ZoomGestureJSON[]): ZoomGesture$1[];
}

declare enum ZoomGestureListenerEvents {
    onZoomInGesture = "ZoomGestureListener.onZoomInGesture",
    onZoomOutGesture = "ZoomGestureListener.onZoomOutGesture"
}

/**
 * Possible values for the torch state.
 *
 * @since 6.5.0
 */
declare enum TorchState {
    /**
     * Value to indicate that the torch is turned on.
     *
     * @since 6.5.0
     */
    On = "on",
    /**
     * Value to indicate that the torch is turned off.
     *
     * @since 6.5.0
     */
    Off = "off",
    /**
     * Value to indicate that the torch is managed automatically. The torch is turned on or off based on the available illumination.
     *
     * On Android this requires camera API 2. To make use of the automatic switch to API 2, make sure that you instantiate the camera directly with the settings instead of using Camera.applySettings().
     *
     * This is an experimental feature. This functionality may or may not work for your use case or may be removed in future version of this software.
     *
     * @since 6.5.0
     */
    Auto = "auto"
}



/**
 * Clears warn-once bookkeeping between test cases.
 * @internal Test-only; not part of this package's consumable surface.
 */
declare function resetCameraControllerPayloadParserWarnings(): void;
/** Native camera events for one camera position, reported by {@link CameraController}. */
interface CameraControllerListener {
    didChangeState(state: FrameSourceState): void;
    didChangeTorchState(torchState: TorchState): void;
    didChangeMacroMode(macroMode: MacroMode): void;
    didChangeZoomLevel(oldZoomLevel: number, newZoomLevel: number): void;
}
declare class CameraController extends BaseController<CoreProxy> {
    private readonly cameraPosition;
    private readonly listener;
    private adapter;
    constructor(cameraPosition: CameraPosition, listener: CameraControllerListener);
    getCurrentState(): Promise<FrameSourceState>;
    getIsTorchAvailable(): Promise<boolean>;
    switchCameraToDesiredState(desiredState: FrameSourceState): Promise<void>;
    subscribeListener(): Promise<void>;
    unsubscribeListener(): Promise<void>;
    subscribeTorchListener(): Promise<void>;
    unsubscribeTorchListener(): Promise<void>;
    subscribeMacroModeListener(): Promise<void>;
    unsubscribeMacroModeListener(): Promise<void>;
    subscribeZoomListener(): Promise<void>;
    unsubscribeZoomListener(): Promise<void>;
    dispose(): void;
    private handleDidChangeStateEvent;
    private handleDidChangeStateEventWrapper;
    private handleDidChangeTorchToStateEvent;
    private handleDidChangeTorchToStateEventWrapper;
    private handleDidChangeMacroModeEvent;
    private handleDidChangeMacroModeEventWrapper;
    private handleDidChangeZoomLevelEvent;
    private handleDidChangeZoomLevelEventWrapper;
}



/** Called when native reports that the camera at `cameraPosition` reached a stable up state. */
type NativeCameraActivatedHandler = (cameraPosition: CameraPosition, state: FrameSourceState) => void;
/**
 * Observes which camera native treats as active.
 *
 * The native `CameraSwitchControl` swaps the DataCaptureContext's active camera on its own when
 * tapped and the TS layer is never told. This controller listens to the frame-source state events
 * (which carry the camera position) and reports each camera that native brought up, so the owner
 * can mirror the switch without issuing any native call.
 */
declare class CameraSwitchControlController extends BaseController<CoreProxy> {
    private readonly onCameraActivated;
    private adapter;
    private subscribed;
    constructor(onCameraActivated: NativeCameraActivatedHandler);
    subscribe(): Promise<void>;
    unsubscribe(): void;
    private handleDidChangeStateWrapper;
    private handleDidChangeState;
}

/**
 * Interface definition for a callback to be invoked when the {@link TorchState} of a {@link Camera} changes.
 *
 * @since 8.3.0
 */
interface TorchListener {
    /**
     * Called when {@link TorchState} changed.
     *
     * @since 8.3.0
     */
    didChangeTorchToState?(state: TorchState): void;
}

/**
 * Interface definition for a callback to be invoked when the {@link MacroMode} of a {@link Camera} changes.
 *
 * This listener only works when running on iOS. On Android, macro mode changes will not be reported.
 *
 * @since 8.3.0
 */
interface MacroModeListener {
    /**
     * Called when {@link MacroMode} changed.
     *
     * @since 8.3.0
     */
    didChangeMacroMode?(macroMode: MacroMode): void;
}

/**
 * Interface definition for a callback to be invoked when the zoom level of a {@link Camera} changes.
 *
 * @since 8.4.0
 */
interface ZoomListener {
    /**
     * Called when the zoom level of the {@link Camera} changed. The zoom levels are expressed as zoom factors (e.g. `1.0` means no zoom, `2.0` means 2x zoom).
     *
     * @since 8.4.0
     */
    didChangeZoomLevel?(oldZoomLevel: number, newZoomLevel: number): void;
}

/** @since 6.11.0 */
declare class ImageBuffer {
    private _width;
    private _height;
    private _data;
    /**
     * Width of the image buffer in pixels (non-subsampled).
     *
     * @since 6.11.0
     */
    get width(): number;
    /**
     * Height of the image buffer in pixels (non-subsampled).
     *
     * @since 6.11.0
     */
    get height(): number;
    /**
     * The base64 encoded image data for the image buffer.
     *
     * @since 6.11.0
     */
    get data(): string;
}
interface PrivateImageBuffer {
    _width: number;
    _height: number;
    _data: string;
}
interface ImageBufferJSON {
    width: number;
    height: number;
    data: string;
}

/**
 * Interface for holding frame data from one or more sources (cameras). The concrete type is tied to the frame source that produces the frames.
 *
 * The frame data contains one or more image buffers, each of which may have different sizes. Each frame data is guaranteed to have at least one image buffer. Only frame sources that combine the input of multiple frame sources will have more than one image buffer.
 *
 * A frame contains the pixel data as well as layout of one particular frame. Frames are immutable and reference counted, so they can be shared by multiple consumers. The frame is returned to the pool (recycled) when all consumers release the frame.
 *
 * The frame must be requested during the execution of the listener callback that the getter promise is passed from, otherwise the frame will not be available outside of that scope.
 *
 * @since 6.11.0
 */
interface FrameData {
    /**
     * The image buffers contained in this frame data.
     *
     * @since 6.11.0
     */
    readonly imageBuffers: ImageBuffer[];
    /**
     * The image buffer contained in this frame data.
     *
     * @since 8.3.0
     */
    readonly imageBuffer: ImageBuffer;
    /**
     * The orientation of the image buffer contained in this frame data. The value is the angle that the camera image needs to be rotated clockwise so it shows correctly on the display in its natural orientation. It is 0, 90, 180, or 270. A typical value for this is 90 as most camera modules record the frames in landscape right orientation. Rotating a landscape right frame by 90 degrees will show it correctly on the display in portrait orientation (which is the natural device orientation of most phones).
     *
     * @since 6.11.0
     */
    readonly orientation: number;
    /**
     * The timestamp of the frame data in ns from the epoch.
     *
     * This property is only available when running on Android. On iOS, this property will return `-1`.
     *
     * @since 8.3.0
     */
    readonly timestamp: number;
}
interface FrameDataJSON {
    imageBuffers: ImageBufferJSON[];
    orientation: number;
    timestamp?: number;
}
declare class PrivateFrameData implements FrameData {
    private _imageBuffers;
    private _orientation;
    private _timestamp;
    get imageBuffers(): ImageBuffer[];
    get imageBuffer(): ImageBuffer;
    get orientation(): number;
    get timestamp(): number;
    static fromJSON(json: FrameDataJSON): FrameData;
    static empty(): FrameData;
}



/**
 * To emit the frame set this object as the `frame source` for the {@link DataCaptureContext} and turn it on by changing the desired state to {@link FrameSourceState.On}.
 *
 * This frame source will turn off automatically after the frame is emitted.
 *
 * The mode settings must use {@link ScanIntention.Manual}. {@link ScanIntention.Smart} has to observe a barcode across several frames before it returns it, which a frame source that emits one image and then turns off cannot provide.
 *
 * This frame source emits a *single* image and turns off again. To feed a continuous stream of frames from a camera your application owns, use {@link SequenceFrameSource} instead — see Sequence Frame Source.Creating an {@link ImageFrameSource} per frame and setting it on the {@link DataCaptureContext} every time is orders of magnitude slower on this platform: each image has to be encoded to be passed over the bridge, and setting a frame source re-serializes the whole context.
 *
 * @since 6.14.0
 */
declare class ImageFrameSource extends DefaultSerializeable implements FrameSource$1 {
    private set context(value);
    private get context();
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.desiredState}.
     *
     * @since 6.14.0
     */
    get desiredState(): FrameSourceState;
    private position;
    private type;
    private image;
    private _id;
    private _desiredState;
    private listeners;
    private _context;
    private controller;
    /**
     * Constructs a new {@link ImageFrameSource} from the provided string, which should contain a Base64 encoded image.
     *
     * @since 6.14.0
     */
    static create(image: string): ImageFrameSource;
    private static fromJSON;
    private constructor();
    /**
     * Convenience method for FrameSource.switchToDesiredState(): it is same as calling FrameSource.switchToDesiredState() with the second argument set to *null*.
     *
     * @since 6.14.0
     */
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.addListener}.
     *
     * @since 6.14.0
     */
    addListener(listener: FrameSourceListener | null): void;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.removeListener}.
     *
     * @since 6.14.0
     */
    removeListener(listener: FrameSourceListener | null): void;
    /**
     * Implemented from {@link FrameSource}. See FrameSource.getCurrentState.
     *
     * @since 6.14.0
     */
    getCurrentState(): Promise<FrameSourceState>;
    private notifyStateChanged;
    private didChange;
    private setNativeFrameSourceIsBeingCreated;
}

/**
 * A frame source that processes frames fed to it via {@link SequenceFrameSource.addFrame},
 * in the order they are added. Use it when the camera is not handled by the SDK (e.g. when
 * another framework owns the camera).
 *
 * Emits frames added via {@link SequenceFrameSource.addFrame}.
 *
 * Use this class when your application, and not the Scandit Data Capture SDK, owns the camera.
 *
 * That is the case when the frames come from a framework that runs its own capture session, such as ARKit on iOS or ARCore on Android, or from a camera plugin your application configures itself.
 *
 * Register an instance of this class as the frame source via {@link DataCaptureContext.frameSource}, switch it to {@link FrameSourceState.On}, and then add the frames coming from the camera via {@link SequenceFrameSource.addFrame}. The frame source never opens, selects or configures a camera itself — it only forwards the frames you push into it.
 *
 * Frames reach the Scandit Data Capture SDK only while FrameSource.getCurrentState is {@link FrameSourceState.On} and the frame source is attached to a {@link DataCaptureContext}, which is why the state has to be switched explicitly, just as it is for {@link Camera}. A frame added before both conditions are true stays in a short internal queue and is emitted as soon as they are. If the queue fills up, the oldest frames are dropped first. Switching the frame source {@link FrameSourceState.Off} again stops processing without discarding that queue.
 *
 * Only one frame is in flight at a time — the next queued frame is emitted once the {@link DataCaptureContext} has finished with the previous one. Pushing frames faster than they can be processed therefore drops frames rather than building up latency.
 *
 * Register the frame source and switch it on **once**, outside of your frame loop, and then call {@link SequenceFrameSource.addFrame} for each frame. Do not create a frame source per frame, and do not set one on the {@link DataCaptureContext} from inside the frame loop. In particular, do not feed a continuous camera stream through {@link ImageFrameSource} — it is meant for single images and turns off after each one.On this platform both mistakes are expensive rather than merely wasteful: setting a frame source re-serializes the whole {@link DataCaptureContext}, and {@link ImageFrameSource} encodes every image it is given to pass it over the bridge. Measured on a Flutter sample at 720p, the per-frame variant cost 520 ms per frame against 21 ms for the loop below.
 *
 * @since 8.6.0
 */
declare class SequenceFrameSource extends DefaultSerializeable implements FrameSource$1 {
    private set context(value);
    private get context();
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.desiredState}.
     *
     * @since 8.6.0
     */
    get desiredState(): FrameSourceState;
    private position;
    private type;
    private _lensPosition;
    private static nextInstanceId;
    private _id;
    private _desiredState;
    private listeners;
    private _context;
    private controller;
    /**
     * Creates a sequence frame source for the given camera position. On iOS the lens position
     * (0.0-1.0) sets the capture device lens position; on Android it is ignored.
     *
     * Constructs a new {@link SequenceFrameSource} for the given {@link CameraPosition}. The lens position (0.0-1.0) sets the capture device lens position on iOS and is ignored on Android.
     *
     * The capture device position neither selects nor opens a camera. Instead, it tells the Scandit Data Capture SDK how to interpret the frames you push: frames declared as coming from a user-facing camera are treated as mirrored. Pass the position of the camera your application is actually reading from.
     *
     * @since 8.6.0
     */
    static create(position: CameraPosition, lensPosition?: number): SequenceFrameSource;
    private static fromJSON;
    private constructor();
    /**
     * Convenience method for FrameSource.switchToDesiredState(): it is the same as calling FrameSource.switchToDesiredState() without a completion handler.
     *
     * @since 8.6.0
     */
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    /**
     * Adds a frame with the given width and height. The frame data must be the Base64 encoding
     * of the raw NV21 bytes of the frame. If this frame source is on and connected to a
     * data capture context, this is the next frame that will be processed.
     *
     * Adds a frame with the given width and height. The frame data must be the Base64 encoding of the raw NV21 bytes of the frame. If this frame source is {@link FrameSourceState.On} and connected to a {@link DataCaptureContext} this is the next frame that will be processed.
     *
     * @since 8.6.0
     */
    addFrame(width: number, height: number, frameData: string): Promise<void>;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.addListener}.
     *
     * @since 8.6.0
     */
    addListener(listener: FrameSourceListener): void;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.removeListener}.
     *
     * @since 8.6.0
     */
    removeListener(listener: FrameSourceListener): void;
    /**
     * Implemented from {@link FrameSource}. See FrameSource.getCurrentState.
     *
     * @since 8.6.0
     */
    getCurrentState(): Promise<FrameSourceState>;
    private notifyStateChanged;
    private didChange;
    private setNativeFrameSourceIsBeingCreated;
}

declare class FrameDataController extends BaseController<CoreProxy> {
    private adapter;
    constructor();
    getFrame(frameId: string): Promise<FrameData>;
    getFrameOrNull(frameId: string): Promise<FrameData | null>;
}

interface CameraSettingsJSON {
    preferredResolution: string;
    zoomFactor: number;
    zoomGestureZoomFactor: number;
    zoomLevels?: number[];
    macroMode?: string;
    adaptiveExposure?: boolean;
    torchLevel?: number;
    focusRange?: string;
    focusGestureStrategy?: string;
    shouldPreferSmoothAutoFocus: boolean;
    properties?: {
        [key: string]: any;
    };
}
interface PrivateCameraSettings {
    fromJSON(json: CameraSettingsJSON): CameraSettings;
}
/**
 * Holds camera-specific settings such as preferred resolution, maximum frame rate etc. The defaults are chosen such that they work for a wide variety of use cases. You may apply custom settings to further optimize scan performance for your particular use case. There is typically no need to customize the camera settings beyond changing the {@link CameraSettings.preferredResolution|preferred resolution}.
 *
 * For best performance use the camera settings returned by the capture mode you are using, e.g. {@link BarcodeCapture.createRecommendedCameraSettings}, or {@link BarcodeBatch.createRecommendedCameraSettings} etc.
 *
 * @since 6.5.0
 */
declare class CameraSettings extends DefaultSerializeable {
    /**
     * The preferred resolution to use for the camera. The camera will use the resolution that is closests to the resolution preference. For example, if only lower resolutions than the preferred resolution are available, the highest available resolution will be used.
     *
     * The resolution chosen by the camera only takes the {@link CameraSettings.preferredResolution} into account, it does not consider the resolution limit of your license key. When the device selects a resolution that is larger than what you have licensed, the data capture context will report a license status error.
     *
     * The default value is {@link VideoResolution.FullHD}.
     *
     * @since 6.5.0
     */
    preferredResolution: VideoResolution;
    /**
     * The zoom factor to use for the camera. This value is a multiplier, a value of 1.0 means no zoom, while a value of 2.0 doubles the size of the image, but halves the field of view.
     *
     * Values less than 1.0 are treated as 1.0. Values greater than the maximum available zoom factor are clamped to the maximum accepted value.
     *
     * The default zoom factor is 1.0.
     *
     * @since 6.5.0
     */
    zoomFactor: number;
    /**
     * The zoom factor to move to when the zoom in gesture was performed. This value is a multiplier, a value of 1.0 means no zoom, while a value of 2.0 doubles the size of the image, but halves the field of view. See also {@link CameraSettings.zoomFactor}.
     *
     * The default zoom factor for the zoom in gesture is 2.0.
     *
     * @since 6.7.0
     * @deprecated Use zoomLevels instead.
     */
    zoomGestureZoomFactor: number;
    /**
     * The set of zoom levels available for zoom gestures and controls. Each value corresponds to a zoom factor that will be applied to the camera when zooming in our out. The camera automatically filters this list based on the camera hardware capabilities, so zoom levels unsupported by the device are omitted.
     *
     * The default value is `[1, 2]`.
     *
     * @since 8.4.0
     */
    zoomLevels: number[];
    /**
     * The torch intensity level. This value must be a number between 0.0 and 1.0. If a number outside the range is provided, either 0.0 or 1.0 will be used instead. Setting the torch level to 0.0 is equivalent to having the torch off.
     *
     * On Android this property has no effect.
     *
     * @since 8.3.0
     */
    torchLevel: number;
    /**
     * The macro mode to use, if supported by the device.
     *
     * The default value is {@link MacroMode.Auto}.
     *
     * On Android this property has no effect.
     *
     * @since 8.3.0
     */
    macroMode: MacroMode;
    /**
     * Enables adaptive exposure optimization for low-light conditions. When enabled, the camera can trade frame rate for brighter images by allowing longer exposure times. In low-light environments, the frame rate may drop from approximately 30fps to 10fps, while the maximum exposure duration increases from ~33ms to up to 100ms. In well-lit conditions, this setting has no impact on frame rate or exposure.
     *
     * This feature is particularly useful for scanning in challenging lighting conditions where image brightness is more critical than maintaining the highest frame rate.
     *
     * The default value is *false*.
     *
     * On Android this property has no effect.
     *
     * @since 8.3.0
     */
    adaptiveExposure: boolean;
    private static get coreDefaults();
    private focusHiddenProperties;
    private focus;
    /**
     * The focus range to primarily use, if supported by the device.
     *
     * On Android changing this property has no effect.
     *
     * @since 6.5.0
     */
    get focusRange(): FocusRange;
    set focusRange(newRange: FocusRange);
    /**
     * The focus gesture strategy to use.
     *
     * @since 6.7.0
     */
    get focusGestureStrategy(): FocusGestureStrategy;
    set focusGestureStrategy(newStrategy: FocusGestureStrategy);
    /**
     * Whether to prefer smooth auto-focus. The default settings have this turned off. Enable it to switch to a smoother (but potentially less reliable) auto-focus strategy. For some devices, this property has no effect.
     *
     * @since 6.8.0
     */
    get shouldPreferSmoothAutoFocus(): boolean;
    set shouldPreferSmoothAutoFocus(newShouldPreferSmoothAutoFocus: boolean);
    private static fromJSON;
    /**
     * Creates a copy of the provided settings.
     *
     * @since 6.5.0
     */
    constructor();
    constructor(settings: CameraSettings);
    /**
     * Sets camera property to the provided value. Use this method to set properties that are not yet part of a stable API. Properties set through this method may or may not be used or change in a future release.
     *
     * @since 6.5.0
     */
    setProperty(name: string, value: any): void;
    /**
     * Retrieves the value of a previously set camera property. In case the property does not exist, *null* is returned.
     *
     * @since 6.5.0
     */
    getProperty(name: string): any;
}

/**
 * Camera lifecycle and operation handling:
 *
 * Phase 1 - Initial State (before native creation starts):
 *   - Camera object exists in TypeScript but not yet being created on native side
 *   - State changes (torch, desired state, settings) only update TypeScript properties
 *   - No native calls are triggered
 *
 * Phase 2 - Native Creation In Progress (after setFrameSource, before context set):
 *   - setFrameSource() called on DataCaptureContext, triggering setNativeFrameSourceIsBeingCreated()
 *   - A promise is created that will resolve when the native camera is ready
 *   - State changes during this phase await the native ready promise before executing
 *   - Native camera is created asynchronously
 *
 * Phase 3 - Active State (after context set):
 *   - Native camera is ready and available
 *   - The native ready promise is resolved
 *   - All state changes execute immediately on native side
 *
 * Gives access to the built-in camera on React Native. It implements the {@link FrameSource} interface, and, as such can be set as the frame source for the {@link DataCaptureContext}.
 *
 * Instances of this class are created through one of the factory methods default(), or atPosition().
 *
 * The camera is started by changing the desired state to {@link FrameSourceState.On}.
 *
 * By default, the resolution of captured frames as well as auto-focus and exposure settings are chosen such that they work best for a variety of use cases. To fine-tune recognition, the camera settings can be changed through applying new {@link CameraSettings|camera settings}.
 *
 * @since 6.5.0
 */
declare class Camera extends DefaultSerializeable implements FrameSource$1 {
    private static readonly _cameraInstances;
    private controller;
    private type;
    private settings;
    private _position;
    private _desiredTorchState;
    private _desiredState;
    private _hasTorchStateListeners;
    private _hasMacroModeListeners;
    private currentCameraState;
    private listeners;
    private torchListeners;
    private macroModeListeners;
    private zoomListeners;
    private _hasZoomListeners;
    private _context;
    private nativeReadyResolver;
    private nativeReadyRejecter;
    private nativeReadyPromise;
    private nativeReadyTimeout;
    private static get coreDefaults();
    /**
     * Constructs a new camera instance with optional position and settings. This constructor provides a convenient way to create a camera with specific configuration parameters. If no position is specified, the system will attempt to use the default camera. If no settings are provided, default camera settings will be applied.
     *
     * @since 8.0.0
     */
    static create(position?: CameraPosition, settings?: CameraSettings | null, desiredTorchState?: TorchState, desiredState?: FrameSourceState): Camera | null;
    /** @since 6.23.0 */
    static withSettings(settings: CameraSettings): Camera | null;
    /** @since 6.25.0 */
    static asPositionWithSettings(cameraPosition: CameraPosition, settings: CameraSettings): Camera | null;
    /**
     * Retrieves the camera instance of the first camera at the provided position. In case the system does not have a camera at the provided position, *null* is returned.
     *
     * When this method is called multiple times with the same argument, the same {@link Camera} instance is returned. The FrameSource.getCurrentState of the camera as well as the settings depend on previous invocations. For example, if the camera is currently in use and is active, the camera’s FrameSource.getCurrentState will be {@link FrameSourceState.On}. The only guarantee about the state and settings is that when instance is initially created, the FrameSource.getCurrentState is {@link FrameSourceState.Off} and has the default {@link CameraSettings}.
     *
     * In case parts of your app use custom camera settings and others use the default settings, make sure to reset the camera to use the default settings when you need them by passing the default camera settings to applySettings() to ensure that you don’t have any other settings when you’d expect the defaults to be active.
     *
     * The camera object is returned if present, regardless whether the application has permissions to use it or not.
     *
     * @since 6.5.0
     */
    static atPosition(cameraPosition: CameraPosition): Camera | null;
    private constructor();
    /**
     * Implemented from {@link FrameSource}. See FrameSource.switchToDesiredState().
     *
     * @since 6.5.0
     */
    switchToDesiredState(state: FrameSourceState): Promise<void>;
    /**
     * Implemented from {@link FrameSource}. See FrameSource.getCurrentState.
     *
     * @since 6.5.0
     */
    getCurrentState(): Promise<FrameSourceState>;
    /**
     * Whether the torch is available for the given camera.
     *
     * Android only: When the camera is off, this method always returns *false*. When the camera is on, it returns *true* for cameras that support the torch, *false* otherwise.
     *
     * @since 6.5.0
     */
    getIsTorchAvailable(): Promise<boolean>;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.addListener}.
     *
     * @since 6.5.0
     */
    addListener(listener: FrameSourceListener | null): void;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.removeListener}.
     *
     * @since 6.5.0
     */
    removeListener(listener: FrameSourceListener | null): void;
    /**
     * Adds a listener that will be called when {@link TorchState} of the camera changes.
     *
     * @since 8.3.0
     */
    addTorchListener(listener: TorchListener): void;
    /**
     * Removes a listener for {@link TorchState} changes.
     *
     * @since 8.3.0
     */
    removeTorchListener(listener: TorchListener): void;
    /**
     * Adds a listener that will be called when {@link MacroMode} of the camera changes.
     *
     * This method only works when running on iOS. On Android, macro mode changes will not be reported.
     *
     * @since 8.3.0
     */
    addMacroModeListener(listener: MacroModeListener): void;
    /**
     * Removes a listener for {@link MacroMode} changes.
     *
     * @since 8.3.0
     */
    removeMacroModeListener(listener: MacroModeListener): void;
    /**
     * Adds a listener that will be called when the zoom level of the camera changes.
     *
     * @since 8.4.0
     */
    addZoomListener(listener: ZoomListener): void;
    /**
     * Removes a previously added listener for zoom level changes.
     *
     * @since 8.4.0
     */
    removeZoomListener(listener: ZoomListener): void;
    /**
     * Applies the camera settings to the camera. The task will complete when the settings have been applied and the camera has switched to use the new settings. If the camera is currently in {@link FrameSourceState.Off} state, the task will complete immediately. If, on the other hand, the camera is currently in {@link FrameSourceState.On} state, the settings will be modified on the fly.
     *
     * @since 6.5.0
     */
    applySettings(settings: CameraSettings): Promise<void>;
    private set context(value);
    private get context();
    private setNativeFrameSourceIsBeingCreated;
    private get isActiveCamera();
    /**
     * Gets the default camera of the device. This method is identical to calling atPosition() repeatedly, first with {@link CameraPosition.WorldFacing}, then with {@link CameraPosition.UserFacing} followed by {@link CameraPosition.Unspecified}, stopping after the first of these calls returns a non-*null* instance.
     *
     * See atPosition() for a more detailed description of the method behavior.
     *
     * @since 6.5.0
     */
    static get default(): Camera | null;
    /**
     * Returns whether macro mode is available for the current device. See {@link MacroMode} for details.
     *
     * On Android this method will always return `false`.
     *
     * @since 8.3.0
     */
    static isMacroModeAvailable(): Promise<boolean>;
    /**
     * The direction that the camera faces.
     *
     * @since 8.3.0
     */
    get position(): CameraPosition;
    /** @since 8.3.0 */
    get isTorchAvailable(): Promise<boolean>;
    /**
     * Implemented from {@link FrameSource}. See {@link FrameSource.desiredState}.
     *
     * @since 6.5.0
     */
    get desiredState(): FrameSourceState;
    /**
     * The desired torch state for this camera. By default, the torch state is {@link TorchState.Off}. When setting the desired torch state to {@link TorchState.On}, the torch will be on as long as the camera is running (the camera’s state is {@link FrameSourceState.On}) and off otherwise.
     *
     * When setting the desired torch state for a camera that does not have a torch (see {@link Camera.getIsTorchAvailable}), this call has no effect.
     *
     * @since 6.5.0
     */
    set desiredTorchState(desiredTorchState: TorchState);
    get desiredTorchState(): TorchState;
    private didChange;
    private handleNativeStateChanged;
    private handleNativeTorchStateChanged;
    private handleNativeMacroModeChanged;
    private handleNativeZoomLevelChanged;
    private resetPhaseState;
}
interface PrivateCamera {
    context: DataCaptureContext | null;
    _position: CameraPosition;
    _desiredState: FrameSourceState;
    currentCameraState: FrameSourceState;
    desiredTorchState: TorchState;
    settings: CameraSettings | null;
    listeners: FrameSourceListener[];
    torchListeners: TorchListener[];
    macroModeListeners: MacroModeListener[];
    zoomListeners: ZoomListener[];
    controller: CameraController;
    get isActiveCamera(): boolean;
    initialize: () => void;
    didChange: () => Promise<void>;
}



/**
 * Control that allows switching between configurable camera zoom levels. The available zoom levels are filtered based on the camera hardware capabilities.
 *
 * You can add this control to a view by calling {@link DataCaptureView.addControl}.
 *
 * @since 6.10.0
 */
declare class ZoomSwitchControl extends DefaultSerializeable implements Control$1 {
    private type;
    private icon;
    private view;
    private anchor;
    private offset;
    private static get coreDefaults();
    /**
     * Content description text used for the control button when zoomed out (Android only).
     *
     * This property is only used on Android. For iOS, use {@link ZoomSwitchControl.accessibilityLabelWhenZoomedOut} instead.
     *
     * @since 8.3.0
     * @deprecated Use the unified `accessibilityLabel` property instead.
     */
    contentDescriptionWhenZoomedOut: string | null;
    /**
     * Content description text used for the control button when zoomed in (Android only).
     *
     * This property is only used on Android. For iOS, use {@link ZoomSwitchControl.accessibilityLabelWhenZoomedIn} instead.
     *
     * @since 8.3.0
     * @deprecated Use the unified `accessibilityLabel` property instead.
     */
    contentDescriptionWhenZoomedIn: string | null;
    /**
     * Accessibility label text used for the control button when zoomed out (iOS only).
     *
     * This property is only used on iOS. For Android, use {@link ZoomSwitchControl.contentDescriptionWhenZoomedOut} instead.
     *
     * @since 8.3.0
     * @deprecated Use the unified `accessibilityLabel` property instead.
     */
    accessibilityLabelWhenZoomedOut: string | null;
    /**
     * Accessibility label text used for the control button when zoomed in (iOS only).
     *
     * This property is only used on iOS. For Android, use {@link ZoomSwitchControl.contentDescriptionWhenZoomedIn} instead.
     *
     * @since 8.3.0
     * @deprecated Use the unified `accessibilityLabel` property instead.
     */
    accessibilityLabelWhenZoomedIn: string | null;
    /**
     * Accessibility hint text used for the control button when zoomed out.
     *
     * This property is only used on iOS. Android does not have an equivalent accessibility hint concept.
     *
     * @since 8.3.0
     * @deprecated Use the unified `accessibilityHint` property instead.
     */
    accessibilityHintWhenZoomedOut: string | null;
    /**
     * Accessibility hint text used for the control button when zoomed in.
     *
     * This property is only used on iOS. Android does not have an equivalent accessibility hint concept.
     *
     * @since 8.3.0
     * @deprecated Use the unified `accessibilityHint` property instead.
     */
    accessibilityHintWhenZoomedIn: string | null;
    /**
     * The orientation of the zoom switch control. Defaults to {@link ZoomSwitchOrientation.Default}.
     *
     * @since 8.4.0
     */
    orientation: ZoomSwitchOrientation;
    /**
     * When *true*, the control is always shown in its expanded state, displaying all zoom levels regardless of user interaction, and {@link ZoomSwitchControl.isExpanded} is always *true*. When *false*, the control can be collapsed. Defaults to *false*.
     *
     * @since 8.4.0
     */
    isAlwaysExpanded: boolean;
    /**
     * Whether the control is currently expanded, showing all zoom levels. Can be set programmatically to expand or collapse the control. When {@link ZoomSwitchControl.isAlwaysExpanded} is *true*, this property always returns *true* and setting it has no effect.
     *
     * @since 8.4.0
     */
    isExpanded: boolean;
    /**
     * The accessibility label. The placeholder `<level>` is replaced with the zoom factor of each button. Defaults to `"Zoom <level>"`.
     *
     * @since 8.4.0
     */
    accessibilityLabel: string;
    /**
     * The accessibility hint. Defaults to `"Adjusts the camera zoom level"`.
     *
     * This property will have no effect when running on Android.
     *
     * @since 8.4.0
     */
    accessibilityHint: string;
    private _selectedZoomLevel;
    /**
     * The currently selected zoom level.
     *
     * @since 8.4.0
     */
    get selectedZoomLevel(): number;
    /**
     * Initializes a new ZoomSwitchControl.
     *
     * @since 8.3.0
     */
    constructor();
    /**
     * Selects the given zoom level, clamped to the range supported by the camera hardware. Returns the actual zoom level that was applied.
     *
     * @since 8.4.0
     */
    selectZoomLevel(level: number): Promise<number>;
    /**
     * The button image displayed when the zoom level is set to 1x.
     *
     * @since 6.10.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    get zoomedOutImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedOutImage(zoomedOutImage: string | null);
    /**
     * The button image displayed when the zoom level is set to 2x.
     *
     * @since 6.10.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    get zoomedInImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedInImage(zoomedInImage: string | null);
    /**
     * The button image displayed when the zoom level is set to 2x and pressed.
     *
     * @since 6.10.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    get zoomedInPressedImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedInPressedImage(zoomedInPressedImage: string | null);
    /**
     * The button image displayed when the zoom level is set to 1x and the button is pressed.
     *
     * @since 6.10.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    get zoomedOutPressedImage(): string | null;
    /** @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0. */
    set zoomedOutPressedImage(zoomedOutPressedImage: string | null);
    /**
     * The button image resource displayed when the zoom level is set to 2x.
     *
     * @since 6.23.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    setZoomedInImage(resource: string): void;
    /**
     * The button image resource displayed when the zoom level is set to 2x and pressed.
     *
     * @since 6.23.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    setZoomedInPressedImage(resource: string): void;
    /**
     * The button image resource displayed when the zoom level is set to 1x.
     *
     * @since 6.23.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    setZoomedOutImage(resource: string): void;
    /**
     * The button image resource displayed when the zoom level is set to 1x and the button is pressed.
     *
     * @since 6.23.0
     * @deprecated Use the new ZoomSwitchControl v2 API. Image-based customization will be removed in 9.0.
     */
    setZoomedOutPressedImage(resource: string): void;
}



/**
 * Control that allows to toggle the torch on and off. The torch switch control hides itself automatically in case the active frame source doesn’t have a torch.
 *
 * You can add this control to a view by calling {@link DataCaptureView.addControl}.
 *
 * @since 6.8.0
 */
declare class TorchSwitchControl extends DefaultSerializeable implements Control$1 {
    private type;
    private icon;
    private view;
    private anchor;
    private offset;
    /**
     * Accessibility label text used for the control button when the torch is off.
     *
     * @since 8.3.0
     */
    accessibilityLabelWhenOff: string | null;
    /**
     * Accessibility hint text used for the control button when the torch is off.
     *
     * This property will have no effect when running on Android.
     *
     * @since 8.3.0
     */
    accessibilityHintWhenOff: string | null;
    /**
     * Accessibility label text used for the control button when the torch is on.
     *
     * @since 8.3.0
     */
    accessibilityLabelWhenOn: string | null;
    /**
     * Accessibility hint text used for the control button when the torch is on.
     *
     * This property will have no effect when running on Android.
     *
     * @since 8.3.0
     */
    accessibilityHintWhenOn: string | null;
    /**
     * Constructor.
     *
     * @since 8.3.0
     */
    constructor();
    /**
     * Sets the image encoded as a base64 string to use for the control button when the torch is off.
     *
     * @since 6.8.0
     */
    get torchOffImage(): string | null;
    set torchOffImage(torchOffImage: string | null);
    /**
     * Sets the image encoded as a base64 string to use for the control button when the torch is off and the button is pressed.
     *
     * @since 6.8.0
     */
    get torchOffPressedImage(): string | null;
    set torchOffPressedImage(torchOffPressedImage: string | null);
    /**
     * Sets the image encoded as a base64 string to use for the control button when the torch is on.
     *
     * @since 6.8.0
     */
    get torchOnImage(): string | null;
    set torchOnImage(torchOnImage: string | null);
    /**
     * Sets the image encoded as a base64 string to use for the control button when the torch is on and the button is pressed.
     *
     * @since 6.8.0
     */
    get torchOnPressedImage(): string | null;
    /**
     * Sets the resource to use for the control button image when the torch is off.
     *
     * @since 6.23.0
     */
    setTorchOffImage(resource: string): void;
    /**
     * Sets the resource to use for the control button image when the torch is off and the button is pressed.
     *
     * @since 6.23.0
     */
    setTorchOffPressedImage(resource: string): void;
    /**
     * Sets the resource to use for the control button image when the torch is on.
     *
     * @since 6.23.0
     */
    setTorchOnImage(resource: string): void;
    /**
     * Sets the resource to use for the control button image when the torch is on and the button is pressed.
     *
     * @since 6.23.0
     */
    setTorchOnPressedImage(resource: string): void;
    /**
     * Sets the image to be used for all the the states of this control.
     *
     * @since 6.23.0
     */
    setImageResource(resource: string): void;
    set torchOnPressedImage(torchOnPressedImage: string | null);
}




/**
 * Control that allows to switch between a primary and a secondary camera.
 *
 * You can add this control to a view by calling {@link DataCaptureView.addControl}.
 *
 * Adding a camera switch control to a view sets the primary camera as the view’s context frame source.
 *
 * @since 8.6.0
 */
declare class CameraSwitchControl extends DefaultSerializeable implements Control$1 {
    private type;
    private _primaryCamera;
    private _secondaryCamera;
    private icon;
    private _view;
    private controller;
    private get view();
    private set view(value);
    private anchor;
    private offset;
    /**
     * Accessibility label text used for the button when the world facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityLabelWhenWorldFacing: string | null;
    /**
     * Accessibility hint text used for the button when the world facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityHintWhenWorldFacing: string | null;
    /**
     * Accessibility label text used for the button when the user facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityLabelWhenUserFacing: string | null;
    /**
     * Accessibility hint text used for the button when the user facing camera is selected.
     *
     * @since 8.6.0
     */
    accessibilityHintWhenUserFacing: string | null;
    /**
     * Initializes a CameraSwitchControl with two cameras.
     *
     * @since 8.6.0
     */
    constructor(primaryCamera: Camera, secondaryCamera: Camera);
    /**
     * The primary camera. Calling {@link DataCaptureView.addControl} sets this camera as the view’s context frame source.
     *
     * @since 8.6.0
     */
    get primaryCamera(): Camera;
    /**
     * The secondary camera.
     *
     * @since 8.6.0
     */
    get secondaryCamera(): Camera;
    /**
     * The button image displayed when the primary camera is selected.
     *
     * @since 8.6.0
     */
    get primaryCameraImage(): string | null;
    set primaryCameraImage(primaryCameraImage: string | null);
    /**
     * The button image displayed when the primary camera is selected and pressed.
     *
     * @since 8.6.0
     */
    get primaryCameraPressedImage(): string | null;
    set primaryCameraPressedImage(primaryCameraPressedImage: string | null);
    /**
     * The button image displayed when the secondary camera is selected.
     *
     * @since 8.6.0
     */
    get secondaryCameraImage(): string | null;
    set secondaryCameraImage(secondaryCameraImage: string | null);
    /**
     * The button image displayed when the secondary camera is selected and pressed.
     *
     * @since 8.6.0
     */
    get secondaryCameraPressedImage(): string | null;
    set secondaryCameraPressedImage(secondaryCameraPressedImage: string | null);
    /**
     * The button image resource displayed when the primary camera is selected.
     *
     * @since 8.6.0
     */
    setPrimaryCameraImage(resource: string): void;
    /**
     * The button image resource displayed when the primary camera is selected and pressed.
     *
     * @since 8.6.0
     */
    setPrimaryCameraPressedImage(resource: string): void;
    /**
     * The button image resource displayed when the secondary camera is selected.
     *
     * @since 8.6.0
     */
    setSecondaryCameraImage(resource: string): void;
    /**
     * The button image resource displayed when the secondary camera is selected and pressed.
     *
     * @since 8.6.0
     */
    setSecondaryCameraPressedImage(resource: string): void;
    private adoptNativeActiveCamera;
}





interface PrivateSwipeToZoom {
    listeners: ZoomGestureListener[];
    onListenersChanged?(): void;
    _controller?: DataCaptureViewController | null;
}
/**
 * Swipe to zoom gesture.
 *
 * @since 6.7.0
 */
declare class SwipeToZoom extends DefaultSerializeable implements ZoomGesture$1 {
    private type;
    private listeners;
    private onListenersChanged?;
    private _controller?;
    /**
     * Constructs a new SwipeToZoom instance. The zoom levels can be changed in the {@link CameraSettings} via the CameraSettings.ZoomLevels property.
     *
     * @since 6.7.0
     */
    constructor();
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.addListener}.
     *
     * @since 8.3.0
     */
    addListener(listener: ZoomGestureListener): void;
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.removeListener}.
     *
     * @since 8.3.0
     */
    removeListener(listener: ZoomGestureListener): void;
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.triggerZoomIn}.
     *
     * @since 8.3.0
     */
    triggerZoomIn(): Promise<void>;
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.triggerZoomOut}.
     *
     * @since 8.3.0
     */
    triggerZoomOut(): Promise<void>;
}



interface PrivatePinchToZoom {
    listeners: ZoomGestureListener[];
    onListenersChanged?(): void;
    _controller?: DataCaptureViewController | null;
}
/**
 * Pinch to zoom gesture.
 *
 * @since 8.4.0
 */
declare class PinchToZoom extends DefaultSerializeable implements ZoomGesture$1 {
    private type;
    private listeners;
    private onListenersChanged?;
    private _controller?;
    /**
     * Constructs a new PinchToZoom instance. The zoom levels can be changed in the {@link CameraSettings} via the CameraSettings.ZoomLevels property.
     *
     * @since 8.4.0
     */
    constructor();
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.addListener}.
     *
     * @since 8.4.0
     */
    addListener(listener: ZoomGestureListener): void;
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.removeListener}.
     *
     * @since 8.4.0
     */
    removeListener(listener: ZoomGestureListener): void;
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.triggerZoomIn}.
     *
     * @since 8.4.0
     */
    triggerZoomIn(): Promise<void>;
    /**
     * Implemented from {@link ZoomGesture}. See {@link ZoomGesture.triggerZoomOut}.
     *
     * @since 8.4.0
     */
    triggerZoomOut(): Promise<void>;
}

declare enum FrameSourceListenerEvents {
    didChangeState = "FrameSourceListener.onStateChanged"
}

declare enum TorchListenerEvents {
    didChangeTorchToState = "TorchListener.onTorchStateChanged"
}

declare enum MacroModeListenerEvents {
    didChangeMacroMode = "MacroModeListener.onMacroModeChanged"
}

interface CameraOwner {
    readonly id: string;
}

declare class CameraOwnershipManager {
    private static instance;
    private readonly owners;
    private readonly waitingQueue;
    private readonly protectedCameras;
    static getInstance(): CameraOwnershipManager;
    private constructor();
    requestOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    requestOwnershipAsync(position: CameraPosition, owner: CameraOwner, timeoutMs?: number): Promise<boolean>;
    releaseOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    isOwner(position: CameraPosition, owner: CameraOwner): boolean;
    getCurrentOwner(position: CameraPosition): CameraOwner | null;
    checkOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    getOwnedPosition(owner: CameraOwner): CameraPosition | null;
    getAllOwnedPositions(owner: CameraOwner): CameraPosition[];
    private enableProtectionForOwner;
    private disableProtectionForPosition;
    private processWaitingQueue;
    private removeFromQueue;
    private protectCameraForOwner;
    private unprotectCamera;
}

declare class CameraOwnershipHelper {
    private static ownershipManager;
    /**
     * Get camera instance for the owner (only works if you own it)
     */
    static getCamera(position: CameraPosition, owner: CameraOwner): Camera | null;
    /**
     * Safely execute camera operations (only works if you own the camera)
     */
    static withCamera<T>(position: CameraPosition, owner: CameraOwner, operation: (camera: Camera) => Promise<T> | T): Promise<T | null>;
    /**
     * Execute camera operations, waiting for ownership if necessary
     */
    static withCameraWhenAvailable<T>(position: CameraPosition, owner: CameraOwner, operation: (camera: Camera) => Promise<T> | T, timeoutMs?: number): Promise<T | null>;
    /**
     * Request ownership and wait if necessary
     */
    static requestOwnership(position: CameraPosition, owner: CameraOwner, timeoutMs?: number): Promise<boolean>;
    /**
     * Release ownership
     */
    static releaseOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    /**
     * Check if owner has ownership
     */
    static hasOwnership(position: CameraPosition, owner: CameraOwner): boolean;
    /**
     * Get the camera position currently owned by the owner (if unknown)
     */
    static getOwnedPosition(owner: CameraOwner): CameraPosition | null;
    /**
     * Get all camera positions currently owned by the owner
     */
    static getAllOwnedPositions(owner: CameraOwner): CameraPosition[];
    /**
     * Release ownership of all cameras owned by the owner
     */
    static releaseAllOwnerships(owner: CameraOwner): void;
}

declare enum ZoomListenerEvents {
    didChangeZoomLevel = "ZoomListener.onZoomLevelChanged"
}

/**
 * Interface for viewfinders. Viewfinders are restricted to the set of viewfinders provided by the Scandit Data Capture SDK, it is not possible for customers to implement this interface and provide custom viewfinder implementations. This interface does not expose any methods or properties, it just serves as a tag for different viewfinder styles.
 *
 * Possible viewfinders are:
 *
 * - {@link AimerViewfinder}
 * - {@link RectangularViewfinder}
 * - {@link LaserlineViewfinder}
 *
 * @since 6.5.0
 */
interface Viewfinder {
}

declare const NoViewfinder: {
    type: string;
};

/**
 * Rectangular viewfinder with an embedded Scandit logo. The rectangle is always centered on the {@link DataCaptureView.pointOfInterest|point of interest} of the view.
 *
 * The rectangular viewfinder is displayed when the recognition is active and hidden when it is not.
 *
 * To use this viewfinder, create a new instance and assign it to the overlay, e.g. the barcode capture overlay via the {@link BarcodeCaptureOverlay.viewfinder} property.
 *
 * @since 6.5.0
 */
declare class RectangularViewfinder extends DefaultSerializeable implements Viewfinder {
    /**
     * The color used to draw the logo and viewfinder when the mode is enabled. The color is always used at full opacity, changing the alpha value has no effect.
     *
     * @since 6.5.0
     */
    color: Color$1;
    private type;
    private _onChange?;
    private readonly _style;
    private readonly _lineStyle;
    private _dimming;
    private _disabledDimming;
    private _animation;
    private _sizeWithUnitAndAspect;
    private _disabledColor;
    /**
     * The size and sizing mode of the viewfinder.
     *
     * @since 6.5.0
     */
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    private set sizeWithUnitAndAspect(value);
    private get coreDefaults();
    /**
     * Constructs a new rectangular viewfinder with {@link RectangularViewfinderStyle.Rounded} and {@link RectangularViewfinderLineStyle.Light}.
     *
     * @since 6.5.0
     */
    constructor();
    constructor(style: RectangularViewfinderStyle);
    constructor(style: RectangularViewfinderStyle, lineStyle: RectangularViewfinderLineStyle);
    /**
     * The style of the viewfinder.
     *
     * @since 6.8.0
     */
    get style(): RectangularViewfinderStyle;
    /**
     * The style of the viewfinder’s lines.
     *
     * @since 6.8.0
     */
    get lineStyle(): RectangularViewfinderLineStyle;
    /**
     * The amount the area outside the viewfinder’s rectangle is dimmed by. Accepts values between 0 (no dimming) and 1 (fully blacked out).
     *
     * @since 6.8.0
     */
    get dimming(): number;
    set dimming(value: number);
    /**
     * The amount the area outside the viewfinder’s rectangle is dimmed by when the mode is disabled. Accepts values between 0 (no dimming) and 1 (fully blacked out).
     *
     * @since 6.11.0
     */
    get disabledDimming(): number;
    set disabledDimming(value: number);
    /**
     * The animation used for the viewfinder, if any.
     *
     * @since 6.8.0
     */
    get animation(): RectangularViewfinderAnimation$1 | null;
    set animation(animation: RectangularViewfinderAnimation$1 | null);
    /**
     * Sets the horizontal and vertical size of the viewfinder to the provided value. When the unit is relative (unit in either x or y is {@link MeasureUnit.Fraction}) the size is computed relative to the view size minus the scan area margins.
     *
     * @since 6.5.0
     */
    setSize(size: SizeWithUnit): void;
    /**
     * Sets the width of the viewfinder and compute height automatically based on the provided height/width aspect ratio. When the unit is relative ({@link MeasureUnit.Fraction}), the width is computed relative to the view size minus the scan area margins.
     *
     * @since 6.5.0
     */
    setWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): void;
    /**
     * Sets the height of the viewfinder and compute width automatically based on the provided width/height aspect ratio. When the unit is relative ({@link MeasureUnit.Fraction}), the height is computed relative to the view size minus the scan area margins.
     *
     * @since 6.5.0
     */
    setHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): void;
    /**
     * Sets the viewfinder size on the short side of the scan area as **fraction** of the scan area size. The size on the long side is calculated based on the provided short side/long side **aspectRatio**.
     *
     * @since 6.8.0
     */
    setShorterDimensionAndAspectRatio(fraction: number, aspectRatio: number): void;
    /**
     * The color used to draw the logo and viewfinder when the mode is disabled. By default transparent.
     *
     * @since 6.11.0
     */
    get disabledColor(): Color$1;
    set disabledColor(value: Color$1);
    private update;
}

/**
 * To use this viewfinder, create a new instance and assign it to the overlay, e.g. the barcode capture overlay via the {@link BarcodeCaptureOverlay.viewfinder} property.
 *
 * @since 6.7.0
 */
declare class AimerViewfinder extends DefaultSerializeable implements Viewfinder {
    /**
     * The color of the outer frame.
     *
     * @since 6.7.0
     */
    frameColor: Color$1;
    /**
     * The color of the central dot. The alpha value is ignored and remains at 70%.
     *
     * @since 6.7.0
     */
    dotColor: Color$1;
    private type;
    private get coreDefaults();
    /**
     * Returns a new aimer viewfinder with default parameters.
     *
     * @since 6.7.0
     */
    constructor();
}

/**
 * A horizontal laser line with a Scandit logo underneath. Toggles color depending on the {@link DataCaptureMode.isEnabled|capture mode enabled} property. The laserline is centered on the data capture view’s {@link DataCaptureView.pointOfInterest|point of interest}.
 *
 * To use this viewfinder, create a new instance and assign it to the overlay, e.g. the barcode capture overlay via the {@link BarcodeCaptureOverlay.viewfinder} property.
 *
 * @since 7.4.0
 */
declare class LaserlineViewfinder extends DefaultSerializeable implements Viewfinder {
    /**
     * The width of the laser line. The laser line is centered on the {@link DataCaptureView.pointOfInterest|point of interest} of the view. When specifying the width with relative units, the width is measured relative to the view’s width minus the horizontal scan area margins.
     *
     * @since 7.4.0
     */
    width: NumberWithUnit;
    /**
     * The color to be used when recognition is enabled/active.
     *
     * @since 7.4.0
     */
    enabledColor: Color$1;
    /**
     * The color to be used when recognition is disabled/inactive.
     *
     * @since 7.4.0
     */
    disabledColor: Color$1;
    private type;
    private get coreDefaults();
    /**
     * Constructs a new laserline viewfinder.
     *
     * @since 7.4.0
     */
    constructor();
}

/**
 * Interface for location selection. Location selections implement a specific strategy how a data object (like a barcode or text) is selected out of multiple visible ones by for example only selecting objects inside a certain area or objects that intersect a certain area. Implementations are provided by {@link RadiusLocationSelection} and {@link RectangularLocationSelection}.
 *
 * Location selection implementations are restricted to the set of location selections provided by the Scandit Data Capture SDK, it is not possible to implement this interface with a custom implementations of location selection. This interface does not expose any methods or properties, it just serves as a unifying type for different selection strategies.
 *
 * @since 6.5.0
 */
interface LocationSelection {
}

declare const NoneLocationSelection: {
    type: string;
};

interface RadiusLocationSelectionJSON {
    radius: NumberWithUnitJSON;
}
interface PrivateRadiusLocationSelection {
    fromJSON(JSON: RadiusLocationSelectionJSON): RadiusLocationSelection;
}
/**
 * Location selection for selecting codes inside a circle with the given radius, centered on the {@link DataCaptureView.pointOfInterest|point of interest}. Any object that touches the circle is returned, objects that do not intersect the circle are filtered out.
 *
 * @since 6.5.0
 */
declare class RadiusLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _radius;
    /**
     * The radius of the circle. When using fractional coordinates, the radius is measured relative to the view’s width.
     *
     * @since 6.5.0
     */
    get radius(): NumberWithUnit;
    static fromJSON(locationSelectionJson: RadiusLocationSelectionJSON): RadiusLocationSelection;
    /**
     * Creates a new radius location selection instance with the specified radius.
     *
     * @since 6.5.0
     */
    constructor(radius: NumberWithUnit);
}

interface RectangularLocationSelectionJSON {
    aspect: SizeWithUnitAndAspectJSON;
}
interface PrivateRectangularLocationSelection {
    fromJSON(JSON: RectangularLocationSelectionJSON): RectangularLocationSelection;
}
/**
 * Location selection for selecting codes inside a rectangle centered on the {@link DataCaptureView.pointOfInterest|point of interest}. Any object that is fully inside the rectangle is returned, objects that are partially or entirely outside of the rectangle are filtered out.
 *
 * @since 6.5.0
 */
declare class RectangularLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _sizeWithUnitAndAspect;
    /**
     * The size and sizing mode of the location selection.
     *
     * @since 6.5.0
     */
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    /**
     * Creates a new rectangular location selection instance with the specified horizontal and vertical size. When the unit is relative (unit in either x or y is {@link MeasureUnit.Fraction}) the size is computed relative to the view size minus the scan area margins.
     *
     * @since 6.5.0
     */
    static withSize(size: SizeWithUnit): RectangularLocationSelection;
    /**
     * Creates a new rectangular location selection instance with the specified width and computes the height based on the provided height/width aspect ratio. When the unit is relative ({@link MeasureUnit.Fraction}), the width is computed relative to the view size minus the scan area margins.
     *
     * @since 6.5.0
     */
    static withWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): RectangularLocationSelection;
    /**
     * Creates a new rectangular location selection instance with the specified height and computes the width based on the provided width/height aspect ratio. When the unit is relative ({@link MeasureUnit.Fraction}), the height is computed relative to the view size minus the scan area margins.
     *
     * @since 6.5.0
     */
    static withHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): RectangularLocationSelection;
    static fromJSON(rectangularLocationSelectionJSON: RectangularLocationSelectionJSON): RectangularLocationSelection;
}



/**
 * Fills the whole view with a single colour.
 *
 * A view holds at most one. This overlay belongs to no capture mode, so the native bridge keys it
 * by type alone (`colorFill:-1`) and cannot tell two instances apart; adding a second is rejected
 * rather than silently attaching an overlay that could never be removed again.
 *
 * Overlay that draws a color across the full view. The overlay fill color can be configured through the {@link ColorFillOverlay.color} property.
 *
 * @since 8.7.0
 */
declare class ColorFillOverlay extends DefaultSerializeable implements DataCaptureOverlay {
    private type;
    private _color;
    private view;
    /**
     * The fill color for this core capture overlay.
     *
     * @since 8.7.0
     */
    get color(): Color$1;
    set color(color: Color$1);
    /**
     * Creates a new {@link ColorFillOverlay} instance with the specified color. On the JavaScript frameworks and Flutter the parameter is optional and defaults to transparent.
     *
     * @since 8.7.0
     */
    constructor(color?: Color$1);
}

declare class ControlImage extends DefaultSerializeable {
    private type;
    private _data;
    private _name;
    static fromBase64EncodedImage(data: string | null): ControlImage | null;
    static fromResourceName(resource: string): ControlImage;
    private constructor();
    isBase64EncodedImage(): boolean;
    get data(): string | null;
}

/**
 * States representing different expiration types.
 *
 * @since 6.21.0
 */
declare enum Expiration {
    /**
     * An expiration date is available.
     *
     * @since 6.21.0
     */
    Available = "available",
    /**
     * The license is perpetual and as such there is no expiration date.
     *
     * @since 6.21.0
     */
    Perpetual = "perpetual",
    /**
     * No information about the expiration date is available for this license type.
     *
     * @since 6.21.0
     */
    NotAvailable = "notAvailable"
}

/**
 * Contains information about the license for which a context was created.
 *
 * @since 6.21.0
 */
declare class LicenseInfo extends DefaultSerializeable {
    private _expiration;
    /**
     * The license’s expiration. This information is not made available for all license types.
     *
     * @since 6.21.0
     */
    get expiration(): Expiration;
}

interface ProxyEvent {
    name: string;
    nativeEventName: string;
}

interface NativeCallerProvider<ProxyType extends string = string> {
    getNativeCaller(proxyType: ProxyType): NativeCaller;
}
declare function registerProxies<ProxyType extends string>(proxyTypeNames: readonly ProxyType[], provider: NativeCallerProvider<ProxyType>): void;

interface FactoryMakerItem {
    instance?: unknown;
    builder?: () => unknown;
}
declare class FactoryMaker {
    static instances: Map<string, FactoryMakerItem>;
    static bindInstance(clsName: string, instance: unknown): void;
    static bindLazyInstance<T>(clsName: string, builder: () => T): void;
    static bindInstanceIfNotExists(clsName: string, instance: unknown): void;
    static getInstance<T>(clsName: string): T | undefined;
    static createInstance<T>(clsName: string): T;
}

declare const CORE_PROXY_TYPE_NAMES: readonly ["CoreProxy", "DataCaptureViewProxy", "DataCaptureContextProxy"];
type CoreProxyType = (typeof CORE_PROXY_TYPE_NAMES)[number];
interface CoreNativeCallerProvider extends NativeCallerProvider<CoreProxyType> {
    /**
     * Whether this framework's bridge needs an explicit event registration before
     * native will deliver log batches at all. Only Cordova does — see
     * `subscribeNativeLogChannel`. Leaving it unset keeps the extra native call
     * off the frameworks that don't need it.
     */
    readonly requiresNativeLogChannel?: boolean;
}

/**
 * Binds the core proxies and arms debug mode on the resulting core proxy.
 *
 * Every framework bootstraps by this one path: the log receiver used to be
 * installed by a copy of the same block in each wrapper's `init*Proxy`, which
 * let the three copies drift. Frameworks whose bridge needs an explicit event
 * registration before native delivers anything declare
 * `requiresNativeLogChannel` on their provider (Cordova alone, today).
 */
declare function registerCoreProxies(provider: CoreNativeCallerProvider): void;

declare function generateIdentifier(): string;

declare const VIEW_CREATION_TIMEOUT_MS = 15000;
declare const VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS = 1000;
interface ViewCreationAttempt {
    succeeded(): void;
    failed(): void;
    isCurrent(): boolean;
}
declare class ViewCreationGate {
    private readonly creationTimeoutMs;
    private readonly preBeginTimeoutMs;
    private created$;
    private resolve;
    private generation;
    private timer;
    private hasWaiter;
    constructor(creationTimeoutMs?: number, preBeginTimeoutMs?: number);
    currentGeneration(): number;
    whenCreated(): Promise<boolean>;
    begin(): ViewCreationAttempt;
    markAbandoned(): void;
    private settle;
    private armTimeout;
    private clearTimer;
    private warn;
}

/**
 * An enumeration of the clustering modes available.
 *
 * @since 8.3.0
 */
declare enum ClusteringMode {
    /**
     * No clustering is performed.
     *
     * @since 8.3.0
     */
    Disabled = "disabled",
    /**
     * Manual clustering is supported. The user can select barcodes which barcodes to cluster using the on-screen UI.
     *
     * @since 8.3.0
     */
    Manual = "manual",
    /**
     * Clustering is automatically performed and cannot be manually tuned.
     *
     * @since 8.3.0
     */
    Auto = "auto",
    /**
     * Clustering is performed automatically, but clusters can also be formed or dissolved manually using the UI.
     *
     * @since 8.3.0
     */
    AutoWithManualCorrection = "autoWithManualCorrection"
}

export { AimerViewfinder, BaseController, CORE_PROXY_LOG_METADATA, CORE_PROXY_TYPE_NAMES, CameraController, CameraOwnershipHelper, CameraOwnershipManager, CameraSettings, CameraSwitchControl, CameraSwitchControlController, ClusteringMode, ColorFillOverlay, ControlImage, CoreProxyAdapter, DataCaptureContextEvents, DataCaptureContextSettings, DataCaptureViewEvents, DefaultSerializeable, Direction, EventDataParser, Expiration, FactoryMaker, Feedback, FocusGestureListenerEvents, FontFamily, FrameDataController, FrameDataSettings, FrameDataSettingsBuilder, FrameSourceListenerEvents, HTMLElementState, HtmlElementPosition, HtmlElementSize, ImageBuffer, ImageFrameSource, LaserlineViewfinder, LicenseInfo, ListenerRegistry, LogCategory, LogLevel, MacroModeListenerEvents, MeasureUnit, ModeBase, NoViewfinder, NoneLocationSelection, Observable, PinchToZoom, PrivateFocusGestureDeserializer, PrivateFrameData, PrivateZoomGestureDeserializer, REDACTED_ARG_KEYS, REDACTED_ARG_METHODS, RadiusLocationSelection, RectWithUnit, RectangularLocationSelection, RectangularViewfinder, SKIP, ScanIntention$1 as ScanIntention, ScanditIcon, ScanditIconBuilder, ScanditIconShape, ScanditIconType, ScanditLogger, SelectionMode$1 as SelectionMode, SequenceFrameSource, SizeWithAspect, SizeWithUnit, SizingMode, Sound, SwipeToZoom, TapToFocus, TextAlignment, TorchListenerEvents, TorchState, TorchSwitchControl, VIEW_CREATION_PRE_BEGIN_TIMEOUT_MS, VIEW_CREATION_TIMEOUT_MS, Vibration, VibrationType, ViewCreationGate, WaveFormVibration, ZoomGestureListenerEvents, ZoomListenerEvents, ZoomSwitchControl, armNativeLogReceiver, buildStaticCoreDefaultsJson, createNativeProxy, ensureCoreDefaults, generateIdentifier, getCoreDefaults, ignoreFromSerialization, ignoreFromSerializationIfNull, installNativeLogReceiver, loadCoreDefaults, markSingleInstancePerView, nameForSerialization, registerCoreProxies, registerProxies, resetCameraControllerPayloadParserWarnings, resetDataCaptureViewPayloadParserWarnings, serializationDefault, setCoreDefaultsLoader, singleInstanceOverlayName, subscribeNativeLogChannel, wrapNativeProxy };
export type { BaseProxy, BrushJSON, CameraControllerListener, CameraOwner, CameraSettingsJSON, ColorJSON, Control$1 as Control, CoreDefaults, CoreNativeCallerProvider, CoreProxy, CoreProxyType, DataCaptureComponent, DataCaptureContextCreationOptions, DataCaptureContextListener, DataCaptureContextProxy, DataCaptureMode, DataCaptureOverlay, DataCaptureView$1 as DataCaptureView, DataCaptureViewControllerListener, DataCaptureViewListener, DataCaptureViewProxy, DidChangeSizeEventPayload, DidChangeStateEventPayload, DidChangeStatusEventPayload, EventPayload, FeedbackJSON, FocusGesture$1 as FocusGesture, FocusGestureJSON, FocusGestureListener, FrameData, FrameDataJSON, FrameSource$1 as FrameSource, FrameSourceDidChangeStateEventPayload, FrameSourceListener, ImageBufferJSON, LocationSelection, LogRecord, LogRecordError, MacroModeListener, MarginsWithUnitJSON, MethodLogMetadata, NativeCallResult, NativeCaller, NativeCallerProvider, NativeCameraActivatedHandler, NumberWithUnitJSON, PointJSON, PointWithUnitJSON, PrivateBrush, PrivateCamera, PrivateCameraSettings, PrivateColor, PrivateContextStatus, PrivateControl, PrivateDataCaptureComponent, PrivateDataCaptureContext, PrivateDataCaptureMode, PrivateDataCaptureOverlay, PrivateFeedback, PrivateImageBuffer, PrivateMarginsWithUnit, PrivateNumberWithUnit, PrivatePinchToZoom, PrivatePoint, PrivatePointWithUnit, PrivateQuadrilateral, PrivateRadiusLocationSelection, PrivateRectangularLocationSelection, PrivateRectangularViewfinderAnimation, PrivateScanditIcon, PrivateSize, PrivateSizeWithUnitAndAspect, PrivateSound, PrivateSwipeToZoom, PrivateTapToFocus, PrivateVibration, PropertyChangeListener, ProxyEvent, QuadrilateralJSON, RadiusLocationSelectionJSON, RectangularLocationSelectionJSON, RectangularViewfinderAnimationJSON, ScanditIconJSON, Serializeable, SizeJSON, SizeWithUnitAndAspectJSON, SoundJSON, StringSerializeable, TorchListener, VibrationJSON, ViewCreationAttempt, Viewfinder, WithControllerDispatch, ZoomGesture$1 as ZoomGesture, ZoomGestureJSON, ZoomGestureListener, ZoomListener };
export { Anchor$1 as Anchor, BaseDataCaptureView, Brush$1 as Brush, Camera, CameraPosition, Color$1 as Color, ContextStatus, DataCaptureContext, DataCaptureViewController, FocusGestureStrategy, FocusRange, FrameSourceState, LogoStyle$1 as LogoStyle, MacroMode, MarginsWithUnit$1 as MarginsWithUnit, NativeProxy, NumberWithUnit, OpenSourceSoftwareLicenseInfo, Orientation, Point, PointWithUnit, Quadrilateral$1 as Quadrilateral, Rect$1 as Rect, RectangularViewfinderAnimation$1 as RectangularViewfinderAnimation, RectangularViewfinderLineStyle, RectangularViewfinderStyle, Size, SizeWithUnitAndAspect, VideoResolution, ZoomSwitchOrientation };
