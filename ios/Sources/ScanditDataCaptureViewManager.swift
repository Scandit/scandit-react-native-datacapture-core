/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import React
import ScanditFrameworksCore

class RNTSDCDataCaptureViewWrapper: UIView {
    weak var viewManager: RNTSDCDataCaptureViewManager?

    override func removeFromSuperview() {
        if let viewManager = viewManager,
           let index = RNTSDCDataCaptureViewManager.containers.firstIndex(of: self) {
            dispatchMain {
                RNTSDCDataCaptureViewManager.containers.remove(at: index)
            }
            
            if let droppedView = RNTSDCDataCaptureViewManager.dataCaptureView {
                RNTSDCDataCaptureViewManager.dataCaptureView = nil
                // on iOS we don't have a callback like the android onDropViewInstance where we can remove the dropped instance.
                // here we just override the willRemoveSubview of the wrapper and notify the core module that the dcview has been removed.
                DeserializationLifeCycleDispatcher.shared.dispatchDataCaptureViewRemoved(view: droppedView)
            }
            
            viewManager.addCaptureViewToLastContainer()
        }
        super.removeFromSuperview()
    }
}

@objc(RNTSDCDataCaptureViewManager)
class RNTSDCDataCaptureViewManager: RCTViewManager, DeserializationLifeCycleObserver {

    static var containers: [RNTSDCDataCaptureViewWrapper] = []

    static var dataCaptureView: DataCaptureView? {
        didSet {
            guard let container = containers.last else {
                return
            }

            guard let dcView = dataCaptureView else {
                return
            }

            if dcView.superview != nil && dcView.superview == container {
                // if attached to the same container do nothing. Removing and adding
                // it again might trigger something in the DataCaptureView that we don't
                // want. (overlay re-drawn, black screen, etc.)
                return
            }

            if dcView.superview != nil {
                dcView.removeFromSuperview()
            }
            dcView.frame = container.bounds
            dcView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            container.addSubview(dcView)
        }
    }

    override class func requiresMainQueueSetup() -> Bool {
        true
    }

    var isObserving = false

    func addCaptureViewToLastContainer() {
        guard let container = RNTSDCDataCaptureViewManager.containers.last,
              let captureView = DataCaptureViewHandler.shared.topmostDataCaptureView else {
            return
        }

        RNTSDCDataCaptureViewManager.dataCaptureView = captureView
    }

    override func view() -> UIView! {

        if !isObserving {
            isObserving = true
        }

        let container = RNTSDCDataCaptureViewWrapper()

        if let dataCaptureview = RNTSDCDataCaptureViewManager.dataCaptureView {
            if dataCaptureview.superview != nil {
                dataCaptureview.removeFromSuperview()
            }
            dataCaptureview.frame = container.bounds
            dataCaptureview.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            container.addSubview(dataCaptureview)
        }
        container.viewManager = self

        dispatchMain {
            RNTSDCDataCaptureViewManager.containers.append(container)
        }

        return container
    }
}
