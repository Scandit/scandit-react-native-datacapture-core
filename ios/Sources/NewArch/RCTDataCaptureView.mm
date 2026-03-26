/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2026- Scandit AG. All rights reserved.
 */

#import "ScanditDataCaptureCore.h"
#import "ScanditDataCaptureCore-Swift.h"

#import <React/RCTViewComponentView.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <ScanditReactNativeDatacaptureCoreSpec/ComponentDescriptors.h>
#import <ScanditReactNativeDatacaptureCoreSpec/Props.h>

using namespace facebook::react;

/// Fabric architecture component view for DataCaptureView.
@interface RCTDataCaptureView : RCTViewComponentView
@end

@implementation RCTDataCaptureView {
    DataCaptureViewContainerWrapper *_containerView;
    BOOL _needsContainerRegistration;
}

static NSMutableArray<DataCaptureViewContainerWrapper *> *_containers;

+ (void)initialize {
    if (self == [RCTDataCaptureView class]) {
        _containers = [NSMutableArray array];
    }
}

+ (NSMutableArray<DataCaptureViewContainerWrapper *> *)containers {
    return _containers;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RNTDataCaptureViewProps>();
        _props = defaultProps;

        _containerView = [[RCTFabricDataCaptureViewWrapper alloc] init];
        _containerView.autoresizingMask = UIViewAutoresizingFlexibleWidth |
                                          UIViewAutoresizingFlexibleHeight;
        [RCTDataCaptureView.containers addObject:_containerView];
        self.contentView = _containerView;
    }
    return self;
}

- (void)setTag:(NSInteger)tag {
    [super setTag:tag];
    _containerView.tag = tag;
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask {
    [super finalizeUpdates:updateMask];
    if (_needsContainerRegistration) {
        _needsContainerRegistration = NO;
        [RCTDataCaptureView.containers addObject:_containerView];

        // After recycle, _containerView stays as our child so its didMoveToSuperview
        // won't fire. Manually set the attachment action that cleanupForRecycle cleared.
        __weak DataCaptureViewContainerWrapper *weakContainer = _containerView;
        _containerView.postFrameSetAction = ^{
            [weakContainer attachDataCaptureViewIfAvailable];
        };
    }
}

- (void)didMoveToSuperview {
    [super didMoveToSuperview];
}

- (void)layoutSubviews {
    [super layoutSubviews];
    if (_containerView.postFrameSetAction) {
        [_containerView layoutSubviews];
    }
}

- (void)prepareForRecycle {
    [super prepareForRecycle];
    [_containerView cleanupForRecycle];

    NSUInteger index = [RCTDataCaptureView.containers indexOfObject:_containerView];
    if (index != NSNotFound) {
        [RCTDataCaptureView.containers removeObjectAtIndex:index];
    }
    _needsContainerRegistration = YES;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
    return concreteComponentDescriptorProvider<RNTDataCaptureViewComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> RNTDataCaptureViewCls(void) { return RCTDataCaptureView.class; }

/// Implementation of bridge class to expose Fabric containers to Swift code.
/// Interface is declared in ScanditDataCaptureCore.h
@implementation RCTFabricDataCaptureViewContainers

+ (NSArray<DataCaptureViewContainerWrapper *> *)containers {
    return RCTDataCaptureView.containers;
}

@end
