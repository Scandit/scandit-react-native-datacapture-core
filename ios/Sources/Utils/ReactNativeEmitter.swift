/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import ScanditFrameworksCore

public class ReactNativeEmitter: Emitter {
    weak var emitter: RCTEventEmitter?

    public init(emitter: RCTEventEmitter) {
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
