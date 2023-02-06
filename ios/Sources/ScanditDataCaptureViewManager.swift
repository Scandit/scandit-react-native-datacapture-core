/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditCaptureCore

class RNTSDCDataCaptureViewWrapper: UIView {
    weak var viewManager: RNTSDCDataCaptureViewManager?

    override func removeFromSuperview() {
        if let viewManager = viewManager,
           let index = viewManager.containers.firstIndex(of: self) {
            viewManager.containers.remove(at: index)
            viewManager.addCaptureViewToLastContainer()
        }
        super.removeFromSuperview()
    }
}

@objc(RNTSDCDataCaptureViewManager)
class RNTSDCDataCaptureViewManager: RCTViewManager {

    internal var containers: [RNTSDCDataCaptureViewWrapper] = []

    override class func requiresMainQueueSetup() -> Bool {
        true
    }

    var isObserving = false

    func addCaptureViewToLastContainer() {
        guard let container = containers.last,
              let coreModule = bridge.module(for: ScanditDataCaptureCore.self) as? ScanditDataCaptureCore,
              let captureView = coreModule.dataCaptureView else {
            return
        }
        if captureView.superview != nil {
            captureView.removeFromSuperview()
        }
        captureView.frame = container.bounds
        captureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        container.addSubview(captureView)
    }

    override func view() -> UIView! {

        if !isObserving {
            isObserving = true
        }
        
        guard let coreModule = bridge.module(for: ScanditDataCaptureCore.self) as? ScanditDataCaptureCore else {
            return nil
        }

        let container = RNTSDCDataCaptureViewWrapper()

        if let dataCaptureview = coreModule.dataCaptureView {
            if dataCaptureview.superview != nil {
                dataCaptureview.removeFromSuperview()
            }
            dataCaptureview.frame = container.bounds
            dataCaptureview.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            container.addSubview(dataCaptureview)
        }
        container.viewManager = self
        containers.append(container)

        return container
    }
}
