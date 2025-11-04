import { NativeCaller } from 'scandit-datacapture-frameworks-core';
export declare class RNNativeCaller implements NativeCaller {
    private nativeModule;
    private nativeEventEmitter;
    constructor(nativeModule: any);
    get framework(): string;
    get frameworkVersion(): string;
    callFn(fnName: string, args: object | undefined | null): Promise<any>;
    registerEvent(evName: string, handler: (args: any) => Promise<void>): Promise<any>;
    unregisterEvent(_evName: string, subscription: any): Promise<void>;
    eventHook(args: any): any;
}
export declare function createRNNativeCaller(nativeModule: any): RNNativeCaller;
