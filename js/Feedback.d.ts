import { DefaultSerializeable } from './private/Serializeable';
declare enum VibrationType {
    default = "default",
    selectionHaptic = "selectionHaptic",
    successHaptic = "successHaptic",
    waveForm = "waveForm"
}
export declare class Vibration extends DefaultSerializeable {
    private type;
    static get defaultVibration(): Vibration;
    static get selectionHapticFeedback(): Vibration;
    static get successHapticFeedback(): Vibration;
    private static fromJSON;
    protected constructor(type: VibrationType);
}
export declare class WaveFormVibration extends Vibration {
    private _timings;
    get timings(): number[];
    private _amplitudes;
    get amplitudes(): number[] | null;
    constructor(timings: number[], amplitudes?: number[] | null);
    toJSON(): object;
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
export {};
