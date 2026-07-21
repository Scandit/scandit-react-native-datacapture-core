/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

import Foundation

// Keep importing React_RCTAppDelegate when reachable: it makes the Swift-visible
// RCTReactNativeFactory type identity match what a consumer AppDelegate sees, so
// its conformance to this protocol resolves on RN >= 0.78 (SDC-32584).
#if canImport(React_RCTAppDelegate)
import React_RCTAppDelegate
#endif

// Gate the RN 0.78+ requirement on RCT_REACT_NATIVE_FACTORY_AVAILABLE (set by the
// podspec when RN >= 0.78), NOT canImport(React_RCTAppDelegate): that module has
// existed since RN ~0.71, so canImport is true on RN < 0.78 where RCTReactNativeFactory
// does not yet exist — which is what broke the build there (SDC-32584).

/// Protocol for AppDelegates that expose a React Native factory (RN 0.78+).
/// Implement this protocol to let the Scandit SDK access your RCTReactNativeFactory
/// for creating native views from JS components.
@objc public protocol ScanditReactNativeFactoryContainer {
    #if RCT_REACT_NATIVE_FACTORY_AVAILABLE
    @objc var reactNativeFactory: RCTReactNativeFactory? { get }
    #else
    // Fallback when RCTReactNativeFactory isn't available (RN < 0.78, or the
    // React_RCTAppDelegate module isn't reachable — Expo + static frameworks). SDC-30774.
    @objc var reactNativeFactory: NSObject? { get }
    #endif
}
