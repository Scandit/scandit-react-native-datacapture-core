import { Feedback } from '../Feedback';
export declare class FeedbackProxy {
    private feedback;
    static forFeedback(feedback: Feedback): FeedbackProxy;
    emit(): void;
}
