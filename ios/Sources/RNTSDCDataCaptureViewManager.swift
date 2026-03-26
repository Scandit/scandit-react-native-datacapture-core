/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import React
import ScanditFrameworksCore

/// Legacy architecture (Paper) wrapper for DataCaptureView.
/// Uses reactTag for view identification.
class RNTSDCDataCaptureViewWrapper: DataCaptureViewContainerWrapper {

    override func didMoveToSuperview() {
        super.didMoveToSuperview()
        containerManager = RNTSDCDataCaptureViewManager.self
    }

    override func getViewId() -> Int {
        self.reactTag?.intValue ?? 0
    }
}

/// Legacy architecture (Paper) view manager for DataCaptureView.
@objc(RNTSDCDataCaptureViewManager)
class RNTSDCDataCaptureViewManager: RCTViewManager, DeserializationLifeCycleObserver, DataCaptureViewContainerManager {

    static var containers: [DataCaptureViewContainerWrapper] = []

    override class func requiresMainQueueSetup() -> Bool {
        false
    }

    override func view() -> UIView! {
        let container = RNTSDCDataCaptureViewWrapper()
        container.containerManager = RNTSDCDataCaptureViewManager.self
        RNTSDCDataCaptureViewManager.containers.append(container)
        return container
    }
}
