/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

enum ScanditDataCaptureCoreEvent: String, CaseIterable {
    case didChangeStatus = "DataCaptureContextListener.onStatusChanged"
    case didStartObservingContext = "DataCaptureContextListener.onObservationStarted"
    case didChangeSize = "DataCaptureViewListener.onSizeChanged"
    case didChangeState = "FrameSourceListener.onStateChanged"
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
        do {
            let bodyData = try JSONSerialization.data(withJSONObject: body, options: [])
            let jsonBody = String(data: bodyData, encoding: .utf8)
            sendEvent(withName: name.rawValue, body: jsonBody)
        } catch {
            sendEvent(withName: name.rawValue, body: body)
        }
        return true
    }
}
