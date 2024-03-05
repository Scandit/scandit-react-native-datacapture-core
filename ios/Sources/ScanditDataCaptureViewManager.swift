/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditFrameworksCore

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
class RNTSDCDataCaptureViewManager: RCTViewManager, DeserializationLifeCycleObserver {

    internal var containers: [RNTSDCDataCaptureViewWrapper] = []

    var dataCaptureView: DataCaptureView? {
        didSet {
            guard let container = containers.last else {
                return
            }

            guard let dcView = dataCaptureView else {
                container.subviews.forEach {
                    $0.removeFromSuperview()
                }
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

    override init() {
        super.init()
        DeserializationLifeCycleDispatcher.shared.attach(observer: self)
    }

    func addCaptureViewToLastContainer() {
        guard let container = containers.last,
              let captureView = dataCaptureView else {
            return
        }
        if captureView.superview != nil && captureView.superview == container {
            // if attached to the same container do nothing. Removing and adding
            // it again might trigger something in the DataCaptureView that we don't
            // want. (overlay re-drawn, black screen, etc.)
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

        let container = RNTSDCDataCaptureViewWrapper()

        if let dataCaptureview = dataCaptureView {
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

    deinit {
        DeserializationLifeCycleDispatcher.shared.detach(observer: self)
    }

    func dataCaptureView(deserialized view: DataCaptureView?) {
        dataCaptureView = view
    }
}
