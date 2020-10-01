import { NumberWithUnit, SizeWithUnit, SizeWithUnitAndAspect } from './Common';
import { DefaultSerializeable } from './private/Serializeable';
export interface LocationSelection {
}
export declare const NoneLocationSelection: {
    type: string;
};
export declare class RadiusLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _radius;
    get radius(): NumberWithUnit;
    constructor(radius: NumberWithUnit);
}
export declare class RectangularLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _sizeWithUnitAndAspect;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    static withSize(size: SizeWithUnit): RectangularLocationSelection;
    static withWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): RectangularLocationSelection;
    static withHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): RectangularLocationSelection;
}
