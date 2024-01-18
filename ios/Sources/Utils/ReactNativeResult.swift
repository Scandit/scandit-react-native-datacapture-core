/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2023- Scandit AG. All rights reserved.
 */

import React
import ScanditFrameworksCore

public struct ReactNativeResult: FrameworksResult {
    private let resolve: RCTPromiseResolveBlock
    private let rejecter: RCTPromiseRejectBlock

    public init(_ resolve: @escaping RCTPromiseResolveBlock,
                _ reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.rejecter = reject
    }

    public func success(result object: Any?) {
        resolve(object)
    }

    public func reject(code: String, message: String?, details: Any?) {
        self.rejecter(code, message, nil)
    }

    public func reject(error: Error) {
        self.rejecter(String(error._code), error.localizedDescription, error as NSError)
    }
}
