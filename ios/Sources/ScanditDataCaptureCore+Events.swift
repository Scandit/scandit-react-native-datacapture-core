/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

enum ScanditDataCaptureCoreEvent: String, CaseIterable {
    case didChangeStatus = "dataCaptureContextListener-didChangeStatus"
    case didStartObservingContext = "dataCaptureContextListener-didStartObservingContext"
    case didChangeSize = "dataCaptureViewListener-didChangeSize"
    case didChangeState = "frameSourceListener-didChangeState"
}

extension ScanditDataCaptureCore {
    public override func supportedEvents() -> [String]! {
        return ScanditDataCaptureCoreEvent.allCases.map({$0.rawValue})
    }

    public override func startObserving() {
        hasListeners = true
    }

    public override func stopObserving() {
        hasListeners = false
    }

    func sendEvent(withName name: ScanditDataCaptureCoreEvent, body: Any!) -> Bool {
        guard hasListeners else { return false }
        sendEvent(withName: name.rawValue, body: body)
        return true
    }
}
