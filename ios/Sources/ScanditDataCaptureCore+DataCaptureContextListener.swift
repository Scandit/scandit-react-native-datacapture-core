/*
* This file is part of the Scandit Data Capture SDK
*
* Copyright (C) 2020- Scandit AG. All rights reserved.
*/

import Foundation
import ScanditCaptureCore

extension ScanditDataCaptureCore: FrameSourceDeserializerDelegate {
    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didStartDeserializingFrameSource frameSource: FrameSource,
                                        from JSONValue: JSONValue) {}

    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didFinishDeserializingFrameSource frameSource: FrameSource,
                                        from JSONValue: JSONValue) {
        guard let camera = frameSource as? Camera else { return }
        camera.addListener(self)

        if JSONValue.containsKey("desiredState") {
            let desiredStateJson = JSONValue.string(forKey: "desiredState")
            var desiredState = FrameSourceState.on
            if SDCFrameSourceStateFromJSONString(desiredStateJson, &desiredState) {
                camera.switch(toDesiredState: desiredState)
            }
        }

        if JSONValue.containsKey("desiredTorchState") {
            let desiredTorchStateJson = JSONValue.string(forKey: "desiredTorchState")
            var desiredTorchState = TorchState.off
            if SDCTorchStateFromJSONString(desiredTorchStateJson, &desiredTorchState) {
                camera.desiredTorchState = desiredTorchState
            }
        }
    }

    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didStartDeserializingCameraSettings settings: CameraSettings,
                                        from JSONValue: JSONValue) {}

    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didFinishDeserializingCameraSettings settings: CameraSettings,
                                        from JSONValue: JSONValue) {}
}

extension ScanditDataCaptureCore: DataCaptureContextListener {
    public func context(_ context: DataCaptureContext, didChange frameSource: FrameSource?) {

    }

    public func context(_ context: DataCaptureContext, didAdd mode: DataCaptureMode) {

    }

    public func context(_ context: DataCaptureContext, didRemove mode: DataCaptureMode) {

    }

    public func context(_ context: DataCaptureContext, didChange contextStatus: ContextStatus) {
        guard sendEvent(withName: .didChangeStatus, body: ["status": contextStatus.jsonString]) else { return }
    }

    public func didStartObserving(_ context: DataCaptureContext) {
        guard sendEvent(withName: .didStartObservingContext, body: []) else { return }
    }
}
