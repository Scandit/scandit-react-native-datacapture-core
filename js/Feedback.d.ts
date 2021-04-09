import { DefaultSerializeable } from './private/Serializeable';
export declare class Vibration extends DefaultSerializeable {
    private type;
    static get defaultVibration(): Vibration;
    static get selectionHapticFeedback(): Vibration;
    static get successHapticFeedback(): Vibration;
    private constructor();
}
export declare class Sound extends DefaultSerializeable {
    resource: string | null;
    static get defaultSound(): Sound;
    constructor(resource: string | null);
}
export declare class Feedback extends DefaultSerializeable {
    static get defaultFeedback(): Feedback;
    private _vibration;
    private _sound;
    private proxy;
    get vibration(): Vibration | null;
    get sound(): Sound | null;
    constructor(vibration: Vibration | null, sound: Sound | null);
    emit(): void;
}
