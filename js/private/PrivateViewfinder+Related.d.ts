import { RectangularViewfinderAnimation } from '../Viewfinder+Related';
export interface RectangularViewfinderAnimationJSON {
    readonly looping: boolean;
}
export interface PrivateRectangularViewfinderAnimation {
    fromJSON(json: RectangularViewfinderAnimationJSON): RectangularViewfinderAnimation;
}
