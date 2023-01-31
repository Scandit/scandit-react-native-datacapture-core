import { DefaultSerializeable } from './private/Serializeable';
export declare class Vibration extends DefaultSerializeable {
    private type;
    static get defaultVibration(): Vibration;
    static get selectionHapticFeedback(): Vibration;
    static get successHapticFeedback(): Vibration;
    private static fromJSON;
    private constructor();
}
export declare class Sound extends DefaultSerializeable {
    resource: string | null;
    static get defaultSound(): Sound;
    private static fromJSON;
    constructor(resource: string | null);
}
export declare class Feedback extends DefaultSerializeable {
    static get defaultFeedback(): Feedback;
    private _vibration;
    private _sound;
    private proxy;
    get vibration(): Vibration | null;
    get sound(): Sound | null;
    private static fromJSON;
    constructor(vibration: Vibration | null, sound: Sound | null);
    emit(): void;
}
