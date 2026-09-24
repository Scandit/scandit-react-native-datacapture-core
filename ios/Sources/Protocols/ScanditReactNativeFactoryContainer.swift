
#if RCT_NEW_ARCH_ENABLED
import React_RCTAppDelegate
#endif

public protocol ScanditReactNativeFactoryContainer {
    #if RCT_NEW_ARCH_ENABLED
    var reactNativeFactory: RCTReactNativeFactory? { get }
    #endif
}