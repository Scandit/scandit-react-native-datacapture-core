/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

extension ScanditDataCaptureCore: FrameSourceListener {
    public func frameSource(_ source: FrameSource, didChange newState: FrameSourceState) {
        guard sendEvent(withName: .didChangeState, body: ["state": newState.jsonString]) else { return }
    }

    public func frameSource(_ source: FrameSource, didOutputFrame frame: FrameData) {}
}
