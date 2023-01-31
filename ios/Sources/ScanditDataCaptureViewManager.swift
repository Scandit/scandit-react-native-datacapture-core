/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditCaptureCore

@objc(RNTSDCDataCaptureViewManager)
class RNTSDCDataCaptureViewManager: RCTViewManager, RNTDataCaptureViewListener {

    internal var container = UIView()

    var dataCaptureView: DataCaptureView? {
        willSet {
            dataCaptureView?.removeFromSuperview()
        }

        didSet {
            guard let dataCaptureView = dataCaptureView else { return }
            dataCaptureView.frame = container.bounds
            dataCaptureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            container.addSubview(dataCaptureView)
        }
    }

    override class func requiresMainQueueSetup() -> Bool {
        return true
    }

    deinit {
        if bridge == nil {
            return;
        }
        guard let coreModule =
            bridge.module(for: ScanditDataCaptureCore.self) as? ScanditDataCaptureCore else { return }
        coreModule.removeRNTDataCaptureViewListener(self)
    }

    var isObserving = false

    override func view() -> UIView! {

        if !isObserving, let coreModule = bridge.module(for: ScanditDataCaptureCore.self) as? ScanditDataCaptureCore {
            isObserving = true
            coreModule.addRNTDataCaptureViewListener(self)
        }

        container = UIView()

        if let dataCaptureview = dataCaptureView {
            dataCaptureview.frame = container.bounds
            dataCaptureview.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            container.addSubview(dataCaptureview)
        }

        return container
    }

    func didUpdate(dataCaptureView: DataCaptureView?) {
        DispatchQueue.main.async {
            self.dataCaptureView = dataCaptureView
        }
    }
}
