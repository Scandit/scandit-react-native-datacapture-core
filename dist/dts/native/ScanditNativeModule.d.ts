import { NativeModule } from "react-native";
export interface ScanditNativeModule extends NativeModule {
    Defaults: JSON;
    Version: string;
    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
    [key: string]: any;
}
export declare function getNativeModule(name: string): ScanditNativeModule;
