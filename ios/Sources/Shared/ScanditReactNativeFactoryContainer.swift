/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

import Foundation

#if canImport(React_RCTAppDelegate)
import React_RCTAppDelegate
#endif

/// Protocol for AppDelegates that expose a React Native factory (RN 0.78+).
/// Implement this protocol to let the Scandit SDK access your RCTReactNativeFactory
/// for creating native views from JS components.
@objc public protocol ScanditReactNativeFactoryContainer {
    #if canImport(React_RCTAppDelegate)
    @objc var reactNativeFactory: RCTReactNativeFactory? { get }
    #else
    // Fallback when the React_RCTAppDelegate Swift module isn't reachable
    // (Expo + static frameworks). SDC-30774.
    @objc var reactNativeFactory: NSObject? { get }
    #endif
}
