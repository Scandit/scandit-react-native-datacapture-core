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
                                        from jsonValue: JSONValue) {
        // Empty on purpose
    }

    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didFinishDeserializingFrameSource frameSource: FrameSource,
                                        from jsonValue: JSONValue) {
        if jsonValue.containsKey("type") {
            let type = jsonValue.string(forKey: "type")
            if type == "camera" {
                guard let camera = frameSource as? Camera else { return }
                camera.addListener(self)
                if jsonValue.containsKey("desiredState") {
                    let desiredStateJson = jsonValue.string(forKey: "desiredState")
                    var desiredState = FrameSourceState.on
                    if SDCFrameSourceStateFromJSONString(desiredStateJson, &desiredState) {
                        camera.switch(toDesiredState: desiredState)
                    }
                }
                if jsonValue.containsKey("desiredTorchState") {
                    let desiredTorchStateJson = jsonValue.string(forKey: "desiredTorchState")
                    var desiredTorchState = TorchState.off
                    if SDCTorchStateFromJSONString(desiredTorchStateJson, &desiredTorchState) {
                        camera.desiredTorchState = desiredTorchState
                    }
                }
            } else {
                guard let imageFrameSource = frameSource as? ImageFrameSource else { return }
                imageFrameSource.addListener(self)
                if jsonValue.containsKey("desiredState") {
                    let desiredStateJson = jsonValue.string(forKey: "desiredState")
                    var desiredState = FrameSourceState.on
                    if SDCFrameSourceStateFromJSONString(desiredStateJson, &desiredState) {
                        imageFrameSource.switch(toDesiredState: desiredState)
                    }
                }
            }
        }
    }

    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didStartDeserializingCameraSettings settings: CameraSettings,
                                        from jsonValue: JSONValue) {
        // Empty on purpose
    }

    public func frameSourceDeserializer(_ deserializer: FrameSourceDeserializer,
                                        didFinishDeserializingCameraSettings settings: CameraSettings,
                                        from jsonValue: JSONValue) {
        // Empty on purpose
    }
}

extension ScanditDataCaptureCore: DataCaptureContextListener {
    public func context(_ context: DataCaptureContext, didChange frameSource: FrameSource?) {
        // Empty on purpose
    }

    public func context(_ context: DataCaptureContext, didAdd mode: DataCaptureMode) {
        // Empty on purpose
    }

    public func context(_ context: DataCaptureContext, didRemove mode: DataCaptureMode) {
        // Empty on purpose
    }

    public func context(_ context: DataCaptureContext, didChange contextStatus: ContextStatus) {
        guard sendEvent(withName: .didChangeStatus, body: ["status": contextStatus.jsonString]) else { return }
    }

    public func didStartObserving(_ context: DataCaptureContext) {
        guard sendEvent(withName: .didStartObservingContext, body: []) else { return }
    }
}
