/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import React
import ScanditFrameworksCore

class RNTSDCDataCaptureViewWrapper: UIView {
    override func removeFromSuperview() {
        if let index = RNTSDCDataCaptureViewManager.containers.firstIndex(of: self) {
            dispatchMain {
                RNTSDCDataCaptureViewManager.containers.remove(at: index)
            }
        }
        if let droppedView = self.findFirstSubview(ofType: DataCaptureView.self) {
            // on iOS we don't have a callback like the android onDropViewInstance where we can remove the dropped instance.
            // here we just override the willRemoveSubview of the wrapper and notify the core module that the dcview has been removed.
            DeserializationLifeCycleDispatcher.shared.dispatchDataCaptureViewRemoved(view: droppedView)
        }
        super.removeFromSuperview()
    }
    
    public func findFirstSubview<T: UIView>(ofType type: T.Type) -> T? {
        return self.subviews.first { $0 is T } as? T
    }
    
    override func didMoveToSuperview() {
        // When the container is added to the RN stack, we need to check if the container has a DCView or not
        if self.findFirstSubview(ofType: DataCaptureView.self) == nil {
            // In case no DCView was still added to the container, we need to check whether a DCView was already
            // created for this container and in case add the view here.
            if let frameworksDataCaptureView = DataCaptureViewHandler.shared.getView(self.reactTag.intValue) {
                guard let currentView = frameworksDataCaptureView.view else {
                    return
                }
                currentView.frame = currentView.bounds
                currentView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
                self.addSubview(currentView)
            }
        }
    }
}

@objc(RNTSDCDataCaptureViewManager)
class RNTSDCDataCaptureViewManager: RCTViewManager, DeserializationLifeCycleObserver {

    static var containers: [RNTSDCDataCaptureViewWrapper] = []

    override class func requiresMainQueueSetup() -> Bool {
        true
    }

    override func view() -> UIView! {
        let container = RNTSDCDataCaptureViewWrapper()

        RNTSDCDataCaptureViewManager.containers.append(container)

        return container
    }
}
