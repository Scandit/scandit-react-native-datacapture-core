import { NativeCaller } from 'scandit-datacapture-frameworks-core';
import { ScanditNativeModule } from './ScanditNativeModule';
export declare class RNNativeCaller implements NativeCaller {
    private nativeModule;
    private _nativeEventEmitter;
    constructor(nativeModule: ScanditNativeModule);
    /**
     * Lazily creates the NativeEventEmitter only when needed (old architecture fallback).
     * Avoids the "NativeEventEmitter was called with a non-null argument without the
     * required addListener method" warning that fires when eagerly constructing the
     * emitter for TurboModule-based native modules.
     */
    private get nativeEventEmitter();
    get framework(): string;
    get frameworkVersion(): string;
    callFn(fnName: string, args: object | undefined | null, _meta?: {
        isEventRegistration?: boolean;
    }): Promise<any>;
    registerEvent(evName: string, handler: (args: any) => Promise<void>): Promise<any>;
    unregisterEvent(evName: string, subscription: any): Promise<void>;
    eventHook(args: any): any;
}
export declare function createRNNativeCaller(nativeModule: ScanditNativeModule): RNNativeCaller;
