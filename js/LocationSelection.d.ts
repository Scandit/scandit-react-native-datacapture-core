import { NumberWithUnit, SizeWithUnit, SizeWithUnitAndAspect } from './Common';
import { DefaultSerializeable } from './private/Serializeable';
import { RadiusLocationSelectionJSON, RectangularLocationSelectionJSON } from './private/PrivateLocationSelection';
export interface LocationSelection {
}
export declare const NoneLocationSelection: {
    type: string;
};
export declare class RadiusLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _radius;
    get radius(): NumberWithUnit;
    static fromJSON(JSON: RadiusLocationSelectionJSON): RadiusLocationSelection;
    constructor(radius: NumberWithUnit);
}
export declare class RectangularLocationSelection extends DefaultSerializeable implements LocationSelection {
    private type;
    private _sizeWithUnitAndAspect;
    get sizeWithUnitAndAspect(): SizeWithUnitAndAspect;
    static withSize(size: SizeWithUnit): RectangularLocationSelection;
    static withWidthAndAspectRatio(width: NumberWithUnit, heightToWidthAspectRatio: number): RectangularLocationSelection;
    static withHeightAndAspectRatio(height: NumberWithUnit, widthToHeightAspectRatio: number): RectangularLocationSelection;
    static fromJSON(rectangularLocationSelectionJSON: RectangularLocationSelectionJSON): RectangularLocationSelection;
}
