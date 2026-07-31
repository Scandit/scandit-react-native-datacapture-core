/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <ScanditReactNativeDatacaptureCoreSpec/ScanditReactNativeDatacaptureCoreSpec.h>
#import <ReactCommon/RCTTurboModule.h>
#import "ScanditDataCaptureCore.h"
#if __has_include(<ScanditDataCaptureCore/ScanditDataCaptureCore-Swift.h>)
#import <ScanditDataCaptureCore/ScanditDataCaptureCore-Swift.h>
#else
#import "ScanditDataCaptureCore-Swift.h"
#endif
#import "SDCTurboModuleEventBridge.h"

/// New Architecture (TurboModule/Fabric) adapter for the Core native module.
/// Inherits from the generated spec base class and uses direct method declarations.
@implementation NativeScanditDataCaptureCore {
    ScanditDataCaptureCoreImpl *_impl;
}

RCT_EXPORT_MODULE(ScanditDataCaptureCore)

- (instancetype)init {
    if (self = [super init]) {
        _impl = [[ScanditDataCaptureCoreImpl alloc] init];
    }
    return self;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)initialize {
    __weak NativeScanditDataCaptureCore *weakSelf = self;
    SDCEventEmitBlock emitterBlock = ^(NSDictionary *_Nonnull payload) {
        __strong NativeScanditDataCaptureCore *strongSelf = weakSelf;
        if (strongSelf) {
            [strongSelf emitOnScanditEvent:payload];
        }
    };
    [_impl setupWith:nil turboEmitter:emitterBlock];
}

- (dispatch_queue_t)methodQueue {
    return [SDCSharedMethodQueue queue];
}

- (NSDictionary *)constantsToExport {
    return [self getConstantsOnMainQueue];
}

- (NSDictionary *)getConstants {
    return [self getConstantsOnMainQueue];
}

- (NSDictionary *)getConstantsOnMainQueue {
    __block NSDictionary *constants;
    if ([NSThread isMainThread]) {
        constants = [_impl getConstants];
    } else {
        dispatch_sync(dispatch_get_main_queue(), ^{
            constants = [_impl getConstants];
        });
    }
    return constants;
}

- (NSArray<NSString *> *)supportedEvents {
    return [_impl supportedEvents];
}

- (void)invalidate {
    [_impl invalidate];
}

// MARK: - Native Module Methods

- (void)executeCore:(NSDictionary *)data
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject {
    [_impl executeCore:data resolve:resolve reject:reject];
}

- (void)createDataCaptureView:(NSDictionary *)data
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
    [_impl createDataCaptureViewWithData:data resolve:resolve reject:reject];
}

- (void)removeDataCaptureView:(NSDictionary *)data
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject {
    [_impl removeDataCaptureViewWithData:data resolve:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeScanditDataCaptureCoreSpecJSI>(params);
}

@end
