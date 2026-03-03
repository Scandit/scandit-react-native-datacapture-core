/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import React
import ScanditFrameworksCore

public protocol ReactNativeEmitting: Emitter {
    init(emitter: RCTEventEmitter)
    func emit(name: String, payload: [String: Any?])
    func hasListener(for event: String) -> Bool
}

public class ReactNativeEmitter: ReactNativeEmitting {
    weak var emitter: RCTEventEmitter?

    public required init(emitter: RCTEventEmitter) {
        self.emitter = emitter
    }

    public func emit(name: String, payload: [String: Any?]) {
        guard let data = try? JSONSerialization.data(withJSONObject: payload),
              let jsonString = String(data: data, encoding: .utf8) else { return }
        emitter?.sendEvent(withName: name, body: jsonString)
    }

    public func hasListener(for event: String) -> Bool {
        true
    }
}
