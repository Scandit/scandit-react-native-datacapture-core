import { RadiusLocationSelection, RectangularLocationSelection } from '../LocationSelection';
import { NumberWithUnitJSON, SizeWithUnitAndAspectJSON } from './PrivateCommon';
export interface RadiusLocationSelectionJSON {
    radius: NumberWithUnitJSON;
}
export interface PrivateRadiusLocationSelection {
    fromJSON(JSON: RadiusLocationSelectionJSON): RadiusLocationSelection;
}
export interface RectangularLocationSelectionJSON {
    aspect: SizeWithUnitAndAspectJSON;
}
export interface PrivateRectangularLocationSelection {
    fromJSON(JSON: RectangularLocationSelectionJSON): RectangularLocationSelection;
}
