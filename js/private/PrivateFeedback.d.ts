import { Feedback, Sound, Vibration } from '../Feedback';
export interface VibrationJSON {
    type: string;
}
export interface PrivateVibration {
    fromJSON(json: VibrationJSON): Vibration;
}
export interface SoundJSON {
    resource: string | null;
}
export interface PrivateSound {
    fromJSON(json: SoundJSON): Sound;
}
export interface FeedbackJSON {
    vibration: VibrationJSON | null;
    sound: SoundJSON | null;
}
export interface PrivateFeedback {
    fromJSON(json: FeedbackJSON): Feedback;
}
