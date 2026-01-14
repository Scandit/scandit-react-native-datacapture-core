import { Feedback, FeedbackProxy } from 'scandit-datacapture-frameworks-core';
export declare class NativeFeedbackProxy implements FeedbackProxy {
    emitFeedback(feedback: Feedback): Promise<void>;
}
