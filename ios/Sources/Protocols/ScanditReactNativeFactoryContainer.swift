#if RCT_NEW_ARCH_ENABLED
import React_RCTAppDelegate
#endif

/// Protocol for AppDelegates that expose a React Native factory (RN 0.78+)
/// Implement this protocol to allow Scandit SDK to access your RCTReactNativeFactory
/// for creating native views from JS components.
public protocol ScanditReactNativeFactoryContainer {
    #if RCT_REACT_NATIVE_FACTORY_AVAILABLE
    /// The React Native factory object (RN 0.78+)
    /// Return your RCTReactNativeFactory instance here.
    var reactNativeFactory: RCTReactNativeFactory? { get }
    #elseif RCT_NEW_ARCH_ENABLED
    /// The React Native factory object.
    /// For RN versions before 0.78, return the object that has a `rootViewFactory` property.
    var reactNativeFactory: AnyObject? { get }
    #endif
}
