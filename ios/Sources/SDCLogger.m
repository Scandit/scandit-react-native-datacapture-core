/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import "SDCLogger.h"
#import <React/RCTLog.h>

@implementation SDCLogger

+ (void)warn:(NSString *)message {
    RCTLogWarn(@"%@", message);
}

@end
