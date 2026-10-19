/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Block type for emitting events via TurboModule's CodegenTypes.EventEmitter.
 * The payload dictionary should contain:
 *   - "name": event name (NSString)
 *   - "data": JSON string of the event data (NSString)
 *   - "viewId": optional view ID (NSNumber)
 *   - "modeId": optional mode ID (NSNumber)
 */
typedef void (^SDCEventEmitBlock)(NSDictionary *_Nonnull payload);

/**
 * Bridge class for TurboModule event emission.
 *
 * This enables Swift code to emit events via the new architecture's
 * CodegenTypes.EventEmitter (emitOnScanditEvent:) without requiring
 * Swift to inherit from the generated ObjC spec base class.
 *
 * Pattern mirrors Android's ReactNativeEventEmitter callback injection.
 */
@interface SDCTurboModuleEventBridge : NSObject

+ (instancetype)sharedInstance;

/**
 * Event emitter for Core module.
 * Set by ScanditDataCaptureCore.mm when new arch is enabled.
 */
@property (nonatomic, copy, nullable) SDCEventEmitBlock coreEventEmitter;

@end

NS_ASSUME_NONNULL_END
