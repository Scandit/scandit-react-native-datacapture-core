/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import "SDCTurboModuleEventBridge.h"

@implementation SDCTurboModuleEventBridge

+ (instancetype)sharedInstance {
    static SDCTurboModuleEventBridge *instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[SDCTurboModuleEventBridge alloc] init];
    });
    return instance;
}

@end
