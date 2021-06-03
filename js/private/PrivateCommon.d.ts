import { Brush, Color, MarginsWithUnit, NumberWithUnit, Point, PointWithUnit, Quadrilateral, Size, SizeWithUnitAndAspect } from '../Common';
export interface PointJSON {
    x: number;
    y: number;
}
export interface PrivatePoint {
    fromJSON(json: PointJSON): Point;
}
export interface QuadrilateralJSON {
    topLeft: PointJSON;
    topRight: PointJSON;
    bottomRight: PointJSON;
    bottomLeft: PointJSON;
}
export interface PrivateQuadrilateral {
    fromJSON(json: QuadrilateralJSON): Quadrilateral;
}
export interface NumberWithUnitJSON {
    value: number;
    unit: string;
}
export interface PrivateNumberWithUnit {
    fromJSON(json: NumberWithUnitJSON): NumberWithUnit;
}
export interface PointWithUnitJSON {
    x: NumberWithUnitJSON;
    y: NumberWithUnitJSON;
}
export interface PrivatePointWithUnit {
    readonly zero: PointWithUnit;
    fromJSON(json: PointWithUnitJSON): PointWithUnit;
}
export interface SizeJSON {
    width: number;
    height: number;
}
export interface PrivateSize {
    fromJSON(json: SizeJSON): Size;
}
export interface SizeWithUnitAndAspectJSON {
    width?: NumberWithUnitJSON;
    height?: NumberWithUnitJSON;
    shorterDimension?: NumberWithUnitJSON;
    aspect?: number;
}
export interface PrivateSizeWithUnitAndAspect {
    fromJSON(json: SizeWithUnitAndAspectJSON): SizeWithUnitAndAspect;
}
export interface MarginsWithUnitJSON {
    left: NumberWithUnitJSON;
    right: NumberWithUnitJSON;
    top: NumberWithUnitJSON;
    bottom: NumberWithUnitJSON;
}
export interface PrivateMarginsWithUnit {
    readonly zero: MarginsWithUnit;
    fromJSON(json: MarginsWithUnitJSON): MarginsWithUnit;
}
export declare type ColorJSON = string;
export interface PrivateColor {
    fromJSON(json: ColorJSON): Color;
}
export interface PrivateBrush {
    readonly copy: Brush;
    defaults: any;
    toJSON(): BrushJSON;
}
export interface BrushJSON {
    fill: {
        color: Color;
    };
    stroke: {
        color: Color;
        width: number;
    };
}
