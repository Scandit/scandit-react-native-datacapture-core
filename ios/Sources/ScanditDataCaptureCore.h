/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>

// Block type for TurboModule event emission (Swift interop)
// Defined unconditionally for Swift header generation, used only in new arch
typedef void (^SDCEventEmitBlock)(NSDictionary *_Nonnull payload);

#ifdef RCT_NEW_ARCH_ENABLED
#import <ScanditReactNativeDatacaptureCoreSpec/ScanditReactNativeDatacaptureCoreSpec.h>
#import <React/RCTInitializing.h>
#import <React/RCTInvalidating.h>
#endif

// Forward declaration for Swift class
@class DataCaptureViewContainerWrapper;

/// Bridge class to expose Fabric containers to Swift code.
/// Returns containers from the Fabric architecture when new arch is enabled,
/// or an empty array when using the legacy architecture.
@interface RCTFabricDataCaptureViewContainers : NSObject
+ (NSArray<DataCaptureViewContainerWrapper *> *)containers;
@end

/// Native module for Scandit Data Capture Core.
/// This Obj-C++ class conforms to the TurboModule spec and delegates to ScanditDataCaptureCoreImpl
/// (Swift). Following the Adapter Pattern from React Native's TurboModule Swift guide.
#ifdef RCT_NEW_ARCH_ENABLED
@interface NativeScanditDataCaptureCore
    : NativeScanditDataCaptureCoreSpecBase <NativeScanditDataCaptureCoreSpec, RCTInitializing,
                                            RCTInvalidating>
#else
@interface NativeScanditDataCaptureCore : RCTEventEmitter <RCTBridgeModule>
#endif
@end
