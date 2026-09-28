import { NativeModule } from "react-native";
export interface ScanditNativeModule extends NativeModule {
    [key: string]: any;
}
export declare function getNativeModule(name: string): ScanditNativeModule;
export declare function getModuleDefaults(name: string): any;
