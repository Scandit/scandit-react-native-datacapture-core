/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import "ScanditDataCaptureCore.h"
#if __has_include(<ScanditDataCaptureCore/ScanditDataCaptureCore-Swift.h>)
#import <ScanditDataCaptureCore/ScanditDataCaptureCore-Swift.h>
#else
#import "ScanditDataCaptureCore-Swift.h"
#endif
#import "SDCTurboModuleEventBridge.h"

/// Old Architecture (Paper/Bridge) adapter for the Core native module.
/// Inherits from RCTEventEmitter and exports methods via RCT_EXPORT_METHOD macros.
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
    [_impl setupWith:self];
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
    [super invalidate];
    [_impl invalidate];
}

// MARK: - Native Module Methods

RCT_EXPORT_METHOD(executeCore
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
    [_impl executeCore:data resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(createDataCaptureView
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
    [_impl createDataCaptureViewWithData:data resolve:resolve reject:reject];
}

RCT_EXPORT_METHOD(removeDataCaptureView
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
    [_impl removeDataCaptureViewWithData:data resolve:resolve reject:reject];
}

@end
