/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import "SDCLogger.h"
#import "ScanditDataCaptureCore.h"
#import "SDCTurboModuleEventBridge.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>
#import <React/RCTConvert.h>
#import <React/RCTLog.h>
#import "SDCDataCaptureView+Defaults.h"
#import "RCTEventEmitter+Private.h"

// SDC-30774: bridge `RCTReactNativeFactory` instead of `import React_RCTAppDelegate`
// to cover the prebuilt React.xcframework path (RN ≥ 0.83 / Expo static), where
// the Swift module is shadowed by Expo's generated React-use-frameworks.modulemap.
#if __has_include(<React-RCTAppDelegate/RCTReactNativeFactory.h>)
#    import <React-RCTAppDelegate/RCTReactNativeFactory.h>
#elif __has_include(<React_RCTAppDelegate/RCTReactNativeFactory.h>)
#    import <React_RCTAppDelegate/RCTReactNativeFactory.h>
#endif
