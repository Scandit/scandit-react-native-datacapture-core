/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import "ScanditDataCaptureCore.h"

void inline LogWarn(NSString *message) { RCTLogWarn(@"%@", message); }

@interface RCT_EXTERN_MODULE (ScanditDataCaptureCore, RCTEventEmitter)

RCT_EXTERN_METHOD(executeCore
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createDataCaptureView
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeDataCaptureView
                  : (NSDictionary *)data resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)
@end
