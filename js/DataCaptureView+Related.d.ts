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
export interface Control {
}
export declare class TorchSwitchControl extends DefaultSerializeable implements Control {
    private type;
    private icon;
    private view;
    get torchOffImage(): string | null;
    set torchOffImage(torchOffImage: string | null);
    get torchOffPressedImage(): string | null;
    set torchOffPressedImage(torchOffPressedImage: string | null);
    get torchOnImage(): string | null;
    set torchOnImage(torchOnImage: string | null);
    get torchOnPressedImage(): string | null;
    set torchOnPressedImage(torchOnPressedImage: string | null);
}
export declare class ZoomSwitchControl extends DefaultSerializeable implements Control {
    private type;
    private icon;
    private view;
    get zoomedOutImage(): string | null;
    set zoomedOutImage(zoomedOutImage: string | null);
    get zoomedInImage(): string | null;
    set zoomedInImage(zoomedInImage: string | null);
    get zoomedInPressedImage(): string | null;
    set zoomedInPressedImage(zoomedInPressedImage: string | null);
    get zoomedOutPressedImage(): string | null;
    set zoomedOutPressedImage(zoomedOutPressedImage: string | null);
}
export declare enum LogoStyle {
    Minimal = "minimal",
    Extended = "extended"
}
