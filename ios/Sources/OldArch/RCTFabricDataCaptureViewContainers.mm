/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import "ScanditDataCaptureCore.h"

/// Old Architecture stub for the Fabric containers bridge.
/// Returns an empty array since Fabric views are not used in old architecture.
@implementation RCTFabricDataCaptureViewContainers

+ (NSArray<DataCaptureViewContainerWrapper *> *)containers {
    return @[];
}

@end
