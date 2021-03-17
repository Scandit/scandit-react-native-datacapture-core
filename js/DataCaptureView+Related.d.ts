import { DefaultSerializeable } from './private/Serializeable';
export interface FocusGesture {
}
export declare class TapToFocus extends DefaultSerializeable implements FocusGesture {
    private type;
    constructor();
}
export interface ZoomGesture {
}
export declare class SwipeToZoom extends DefaultSerializeable implements ZoomGesture {
    private type;
    constructor();
}
