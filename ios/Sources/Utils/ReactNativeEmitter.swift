/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import React
import ScanditFrameworksCore

/// Event emitter that supports both old and new React Native architectures.
///
/// Old architecture: Uses RCTEventEmitter.sendEvent
/// New architecture: Uses the generated spec base class's emitOnScanditEvent method
///
/// This mirrors Android's ReactNativeEventEmitter which accepts a lambda that calls
/// the module's emit method.
@objcMembers
open class ReactNativeEmitter: NSObject, Emitter {
    public weak var emitter: RCTEventEmitter?
    private var turboEmitter: SDCEventEmitBlock?

    /// Creates a new ReactNativeEmitter with the given RCTEventEmitter.
    /// - Parameter emitter: The RCTEventEmitter to use for sending events (old architecture).
    public init(emitter: RCTEventEmitter?) {
        self.emitter = emitter
        super.init()
    }

    /// Creates a new ReactNativeEmitter with both old and new architecture emitters.
    /// - Parameters:
    ///   - emitter: The RCTEventEmitter to use for old architecture (can be nil in new arch).
    ///   - turboEmitter: The TurboModule emitter block for new architecture.
    public init(emitter: RCTEventEmitter?, turboEmitter: SDCEventEmitBlock?) {
        self.emitter = emitter
        self.turboEmitter = turboEmitter
        super.init()
    }

    public func emit(name: String, payload: [String: Any?]) {
        guard let data = try? JSONSerialization.data(withJSONObject: payload),
            let jsonString = String(data: data, encoding: .utf8)
        else { return }

        // Build the payload matching the spec's ScanditEventPayload type
        var reactPayload: [String: Any] = [
            "name": name,
            "data": jsonString,
        ]

        // Extract viewId/modeId to top level for pre-parse filtering on JS side
        if let viewId = payload["viewId"] as? Int {
            reactPayload["viewId"] = viewId
        }
        if let modeId = payload["modeId"] as? Int {
            reactPayload["modeId"] = modeId
        }

        // New architecture: use the TurboModule emitter block
        if let turboEmitter = self.turboEmitter {
            // Convert [String: Any] to [AnyHashable: Any] for the block parameter
            let payload = reactPayload as [AnyHashable: Any]
            turboEmitter(payload)
        } else {
            // Old architecture: use RCTEventEmitter.sendEvent
            emitter?.sendEvent(withName: name, body: reactPayload)
        }
    }

    public func hasListener(for event: String) -> Bool {
        true
    }

    public func hasViewSpecificListenersForEvent(_ viewId: Int, for event: String) -> Bool {
        true
    }

    public func hasModeSpecificListenersForEvent(_ modeId: Int, for event: String) -> Bool {
        true
    }
}
