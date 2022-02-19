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

RCT_EXTERN_METHOD(contextFromJSON
                  : (NSString *)JSON resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(updateContextFromJSON
                  : (NSString *)JSON resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(dispose)

RCT_EXTERN_METHOD(emitFeedback
                  : (NSString *)JSON resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(viewQuadrilateralForFrameQuadrilateral
                  : (NSString *)JSON resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(viewPointForFramePoint
                  : (NSString *)JSON resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCurrentCameraState
                  : (NSString *)cameraPosition resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isTorchAvailable
                  : (NSString *)cameraPosition resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLastFrame
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerListenerForCameraEvents)

RCT_EXTERN_METHOD(unregisterListenerForCameraEvents)

RCT_EXTERN_METHOD(registerListenerForEvents)

RCT_EXTERN_METHOD(unregisterListenerForEvents)

RCT_EXTERN_METHOD(registerListenerForViewEvents)

RCT_EXTERN_METHOD(unregisterListenerForViewEvents)

@end
